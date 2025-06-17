import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import html2canvas from 'html2canvas';
import * as QRCode from 'qrcode-generator';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;
  logo2: string = './assets/logo2.png';

  constructor(private http: HttpClient) {}

  getMachines(): Observable<any> {
    return this.http.get(`${this.baseUrl}/activos`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/activosPriv/${id}`);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/activos/${id}`, data);
  }

  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/categorias`);
  }

  getTipoActivo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tipoactivo`);
  }

  uploadImagen(id: number, formData: FormData): Observable<any> {
    return this.http.post<{ message: string; activo: any }>(
      `${this.baseUrl}/activos/${id}/image`,
      formData,
      {
        observe: 'response', // 👈 capturamos todo el response (headers, status, body)
        responseType: 'json' // 👈 explícito por claridad
      }
    ).pipe(
      timeout(15000), // ⏱️ timeout por si se cuelga
      map(response => response.body), // extraemos solo el body
      catchError(error => {
        console.error('Error al subir la imagen:', error);
        return throwError(() => new Error('No se pudo subir la imagen'));
      })
    );
  }

  generateQRData(activo: any): string {
    const baseUrl = 'https://maquicontrol-public-dot-maquicontrol-90a19.ew.r.appspot.com/vistaactivo'; // Cambia por tu URL real
    const activoUrl = `${baseUrl}/${activo.id}`;

    return activoUrl;

  }

  private buildQRCodeHTML(qrSvg: string, logoUrl?: string, activo?: any): string {
    const topText1 = activo?.nombre_empresa || '';
    const topText2 = activo?.marca || '';
    const bottomText1 = activo?.modelo || '';
    const bottomText2 = activo?.num_parque || activo?.matricula || '';

    return `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 600px;
        height: 800px;
        background: white;
        padding: 32px;
        gap: 16px;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
      ">
        <div style="font-weight: bold; font-size: 24px; text-align: center;">${topText1}</div>
        <div style="font-weight: bold; font-size: 24px; text-align: center;">${topText2}</div>
        <div style="position: relative; display: flex; justify-content: center; align-items: center;">
          ${qrSvg}
          ${logoUrl ? `<img src="${logoUrl}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 140px; border-radius: 8px; background: white; padding: 4px;" alt="Logo">` : ''}
        </div>
        <div style="font-weight: bold; font-size: 24px; text-align: center;">${bottomText1}</div>
        <div style="font-weight: bold; font-size: 24px; text-align: center;">${bottomText2}</div>
      </div>
    `;
  }

  private async renderToCanvas(htmlContent: string): Promise<HTMLCanvasElement> {
    const qrElement = document.createElement('div');
    qrElement.style.position = 'absolute';
    qrElement.style.left = '-9999px';
    qrElement.innerHTML = htmlContent;
    document.body.appendChild(qrElement);

    await this.waitForImages(qrElement);

    // Escala de alta resolución
    const scale = 3;
    qrElement.style.transform = `scale(${scale})`;
    qrElement.style.transformOrigin = 'top left';
    qrElement.style.width = `${600 * scale}px`;
    qrElement.style.height = `${800 * scale}px`;

    const scaledCanvas = await html2canvas(qrElement, {
      logging: false,
      useCORS: true,
      width: 600 * scale,
      height: 800 * scale
    });

    // Redimensionamos a 600x800
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = 600;
    finalCanvas.height = 800;
    const ctx = finalCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(scaledCanvas, 0, 0, finalCanvas.width, finalCanvas.height);
    }

    document.body.removeChild(qrElement);
    return finalCanvas;
  }

  private async waitForImages(container: HTMLElement): Promise<void> {
    const images = Array.from(container.querySelectorAll('img'));
    await Promise.all(
      images.map(img =>
        new Promise<void>(resolve => {
          if (img.complete) resolve();
          else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        })
      )
    );
  }

  private downloadImage(canvas: HTMLCanvasElement, fileName: string) {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  private async downloadPDF(canvas: HTMLCanvasElement, fileName: string) {
    const { jsPDF } = await import('jspdf');
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(fileName);
  }

  async generateQRBase64(
    qrData: string,
    format: 'png' = 'png',
    logoUrl?: string,
    activo?: any
  ): Promise<string> {
    try {
      const qr = QRCode(0, 'H');
      qr.addData(qrData);
      qr.make();
      const qrSvg = qr.createSvgTag({ cellSize: 4, margin: 0 });
      const html = this.buildQRCodeHTML(qrSvg, logoUrl, activo);
      const canvas = await this.renderToCanvas(html);
      return canvas.toDataURL(`image/${format}`);
    } catch (error) {
      console.error('Error al generar QR Base64:', error);
      throw error;
    }
  }

  async generateAndDownloadQR(
    qrData: string,
    fileName?: string,
    format: 'png' | 'pdf' | 'svg' = 'png',
    logoUrl?: string,
    activo?: any
  ): Promise<boolean> {
    try {
      const qr = QRCode(0, 'H');
      qr.addData(qrData);
      qr.make();

      const qrSvg = qr.createSvgTag({ cellSize: 10, margin: 0 });
      const html = this.buildQRCodeHTML(qrSvg, logoUrl, activo);

      const nombreEmpresa = (activo?.nombre_empresa || 'QR').replace(/\s+/g, '_');
      const numParque = (activo?.num_parque || 'sin_parque').toString().replace(/\s+/g, '_');
      const finalFileName =  `${nombreEmpresa}-${numParque}`;

      if (format === 'svg') {
        const svgWithWrapper = `
          <svg xmlns="http://www.w3.org/2000/svg" width="600" height="800">
            <foreignObject width="100%" height="100%">
              ${html}
            </foreignObject>
          </svg>
        `;
        this.downloadSVG(svgWithWrapper, `${finalFileName}.svg`);
        return true;
      }

      const canvas = await this.renderToCanvas(html);

      if (format === 'png') {
        this.downloadImage(canvas, `${finalFileName}.png`);
      } else {
        await this.downloadPDF(canvas, `${finalFileName}.pdf`);
      }

      return true;
    } catch (error) {
      console.error('Error al generar y descargar QR:', error);
      return false;
    }
  }

  private downloadSVG(svgContent: string, fileName: string) {
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  getBotonesByActivoId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/botones?id=${id}`);
  }

  updateBoton(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/botones/${id}`, data);
  }

  deleteBoton(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/botones/${id}`);
  }

  getArchivosDeBoton(botonId: number, activoId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/botones/${botonId}/files/${activoId}`);
  }


}
