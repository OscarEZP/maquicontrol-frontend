import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError, timeout } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

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
}
