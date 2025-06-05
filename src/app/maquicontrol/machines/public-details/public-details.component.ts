import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-public-details',
  templateUrl: './public-details.component.html',
  styleUrls: ['./public-details.component.scss']
})
export class PublicDetailsComponent {
  // Datos principales (puedes reemplazarlos con datos reales o @Input())
  nombre: string = 'Jaguar Malte';
  categoria: string = 'CARRETILLAS';
  tipoMotor: string = 'diesel';
  estado: string = 'activo';
  imageUrl: string = 'https://images.prismic.io/carwow/7ab1f02a-b0c1-4aec-898b-37b1fddc444e_hyundai-all-new-tucson-1120-07+%281%29.jpg';

  expandir = false;
  maxVisible = 6;

  @HostListener('window:scroll', [])
    onWindowScroll() {
      const y = window.scrollY || document.documentElement.scrollTop;
      this.expandir = y > 50;
    }

  acciones = [
    { label: 'Multimedia', icon: 'image' },
    { label: 'Editar', icon: 'edit' },
    { label: 'Eliminar', icon: 'delete' },
    { label: 'Manual', icon: 'description' },
    { label: 'Configuración', icon: 'settings' },
    { label: 'Subir Archivos', icon: 'cloud_upload' },
    { label: 'Documentos', icon: 'folder_open' },
    { label: 'Videos', icon: 'smart_display' },
    { label: 'Historial', icon: 'history' },
  ];

  // Detalles técnicos
  largo = '33';
  alturaTrabajo = '44';
  alto = '44';
  cargaMax = '100';
  ancho = 'ancho';
  peso = 'peso';
  inclinacionFrontal = '12,2';
  inclinacionLateral = 'N/A';

  // Motor diésel
  motorDiesel = {
    marca: '3',
    modelo: '4',
    cilindrada: '5',
    voltaje_sistema: '3',
    deposito: '4'
  };

  get visibleAcciones() {
    return this.expandir ? this.acciones : this.acciones.slice(0, this.maxVisible);
  }

  toggleExpand() {
    this.expandir = !this.expandir;
  }
}
