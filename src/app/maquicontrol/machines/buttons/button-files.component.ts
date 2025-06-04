import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-button-files',
  templateUrl: './button-files.component.html',
  styleUrl: './buttons.component.scss'

})
export class ButtonFilesComponent {
  archivos: { nombre: string, tipo: string, url: string }[] = [];
  uploadedFiles: {
    nombre: string;
    tipo: 'image' | 'pdf' | 'docx' | 'other';
    tipoOriginal: string;
    preview?: string;
  }[] = [];

  esImagen(tipo: string): boolean {
    return ['jpg', 'jpeg', 'png', 'svg'].includes(tipo.toLowerCase());
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { botonId: string }) {
    // Aquí podrías cargar archivos reales asociados al botón
    this.cargarArchivos();
  }

  cargarArchivos() {
    // Simulación de carga
    this.archivos = [
      { nombre: 'Manual.pdf', tipo: 'pdf', url: 'https://docs.google.com/document/d/1cJagyaF7mz6UoiCI6hBsk6uZJZQ-yfjFUogpDIQoHkY/edit?tab=t.0' },
      { nombre: 'Foto1.jpg', tipo: 'jpg', url: 'data:image/jpeg;base64,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' },
      { nombre: 'Informe.docx', tipo: 'docx', url: '...' },
      { nombre: 'Manual.pdf', tipo: 'pdf', url: '...' },
      { nombre: 'Foto1.jpg', tipo: 'jpg', url: '...' },
      { nombre: 'Informe.docx', tipo: 'docx', url: '...' },
      { nombre: 'Manual.pdf', tipo: 'pdf', url: '...' },
      { nombre: 'Foto1.jpg', tipo: 'jpg', url: '...' },
      { nombre: 'Informe.docx', tipo: 'docx', url: '...' },
      { nombre: 'Manual.pdf', tipo: 'pdf', url: '...' },
      { nombre: 'Foto1.jpg', tipo: 'jpg', url: '...' },
      { nombre: 'Informe.docx', tipo: 'docx', url: '...' },
      { nombre: 'Manual.pdf', tipo: 'pdf', url: '...' },
      { nombre: 'Foto1.jpg', tipo: 'jpg', url: '...' },
      { nombre: 'Informe.docx', tipo: 'docx', url: '...' },
      { nombre: 'Manual.pdf', tipo: 'pdf', url: '...' },
      { nombre: 'Foto1.jpg', tipo: 'jpg', url: '...' },
      { nombre: 'Informe.docx', tipo: 'docx', url: '...' },
      { nombre: 'Manual.pdf', tipo: 'pdf', url: '...' },
      { nombre: 'Foto1.jpg', tipo: 'jpg', url: '...' },
      { nombre: 'Informe.docx', tipo: 'docx', url: '...' },
      { nombre: 'Manual.pdf', tipo: 'pdf', url: '...' },
      { nombre: 'Foto1.jpg', tipo: 'jpg', url: '...' },
      { nombre: 'Informe.docx', tipo: 'docx', url: '...' },
      { nombre: 'Manual.pdf', tipo: 'pdf', url: '...' },
      { nombre: 'Foto1.jpg', tipo: 'jpg', url: '...' },
      { nombre: 'Informe.docx', tipo: 'docx', url: '...' },
      // etc.
    ];
  }

  eliminarArchivo(archivo: { nombre: string }) {
    this.archivos = this.archivos.filter(a => a !== archivo);
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

      const fileData: any = { nombre, tipo, tipoOriginal };

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
    });
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }


}
