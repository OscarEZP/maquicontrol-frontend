import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Component({
  selector: 'app-button-files',
  templateUrl: './button-files.component.html',
  styleUrl: './buttons.component.scss'

})
export class ButtonFilesComponent {

  archivos: { nombre: string, tipo: string, url: string, referencia: string }[] = [];
  uploadedFiles: {
    nombre: string;
    tipo: 'image' | 'pdf' | 'docx' | 'other';
    tipoOriginal: string;
    referencia: string;
    file: File;
    preview?: string;
  }[] = [];

  esImagen(tipo: string): boolean {
    return ['jpg', 'jpeg', 'png', 'svg', 'image'].includes(tipo.toLowerCase());
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { botonId: any, activoId: any }, private apiService: ApiService, private dialog: MatDialog) {
    // Aquí podrías cargar archivos reales asociados al botón
    this.cargarArchivos();
  }

  cargarArchivos() {
    this.apiService.getArchivosDeBoton(this.data.botonId, this.data.activoId).subscribe({
      next: (response) => {
        const { imagenes = [], pdfs = [], videos = [] } = response;

        const archivos: { nombre: string; tipo: string; url: string, referencia: string }[] = [];

        imagenes.forEach((img: any) => archivos.push({ nombre: img.nombre, tipo: 'image', url: img.url, referencia: img.referencia }));
        pdfs.forEach((pdf: any) => archivos.push({ nombre: pdf.nombre, tipo: 'pdf', url: pdf.url, referencia: pdf.referencia }));
        videos.forEach((vid: any) => archivos.push({ nombre: vid.nombre, tipo: 'video', url: vid.url, referencia: vid.referencia }));

        this.archivos = archivos;
      },
      error: (err) => {
        console.error('Error al cargar archivos del botón:', err);
      }
    });
  }

  eliminarArchivo(archivo: any) {
    console.log(archivo)
    const referencia = archivo.referencia

    this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { nombre: archivo.nombre }
    }).afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.apiService.deleteArchivoDeActivo(this.data.activoId, referencia).subscribe({
          next: () => {
            console.log('Archivo eliminado con éxito');
            this.cargarArchivos(); // refresca la lista
          },
          error: err => {
            console.error('Error al eliminar archivo:', err);
          }
        });
      }
    });
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      this.procesarArchivos(event.dataTransfer.files);
    }
  }

  onFileSelected(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      this.procesarArchivos(files);
    }
  }

  procesarArchivos(files: FileList) {
    Array.from(files).forEach(file => {
      const tipoOriginal = file.type;
      const nombre = file.name;

      let tipo: 'image' | 'pdf' | 'docx' | 'other' = 'other';
      if (tipoOriginal.startsWith('image/')) {
        tipo = 'image';
      } else if (tipoOriginal === 'application/pdf') {
        tipo = 'pdf';
      } else if (
        tipoOriginal === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name.endsWith('.docx')
      ) {
        tipo = 'docx';
      }

      const fileData: any = {
        nombre,
        tipo,
        tipoOriginal,
        file
      };

      if (tipo === 'image') {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          fileData.preview = e.target.result;
          this.uploadedFiles.push(fileData);
        };
        reader.readAsDataURL(file);
      } else {
        this.uploadedFiles.push(fileData);
      }

      // Subir automáticamente al cargar
      this.apiService.uploadArchivosParaBoton(this.data.activoId, this.data.botonId, [file]).subscribe({
        next: res => {
          console.log('Archivo guardado exitosamente:', res);
          this.cargarArchivos(); // actualiza lista principal
        },
        error: err => {
          console.error('Error al guardar archivo:', err);
        }
      });
    });
  }


  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }


}
