import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-public-details',
  templateUrl: './public-details.component.html',
  styleUrls: ['./public-details.component.scss']
})
export class PublicDetailsComponent implements OnInit {
  activoId!: number;

  nombre = '';
  categoria = '';
  tipoMotor = '';
  estado = '';
  imageUrl = '';

  expandir = false;
  maxVisible = 6;

  acciones: any[] = []; // se cargan desde /api/botones?id=:id

  // Detalles técnicos
  largo = '';
  alturaTrabajo = '';
  alto = '';
  cargaMax = '';
  ancho = '';
  peso = '';
  inclinacionFrontal = '';
  inclinacionLateral = '';
  anioFabricacion = '';
  numeroSerie = '';
  modelo = '';
  matricula = '';
  numeroParque = '';
  tipo = '';

  telefonos: {
    comercial?: string;
    taller?: string;
    oficina?: string;
  } = {};

  motorDiesel: any;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    this.expandir = y > 50;
  }

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.activoId = +id;
        this.cargarDatosActivo();
        this.cargarBotones();
      }
    });
  }

  cargarDatosActivo(): void {
    this.apiService.getActivoById(this.activoId).subscribe({
      next: (data: any) => {
        const activo = data.activo;
        this.nombre = activo.nombre;
        this.categoria = activo.nombre_categoria;
        this.tipoMotor = activo.tipo_motor;
        this.imageUrl = activo.imagen;
        this.anioFabricacion = activo.anio_fabricacion;
        this.numeroSerie = activo.num_serie;
        this.modelo = activo.modelo;
        this.matricula = activo.matricula;
        this.numeroParque = activo.num_parque;
        this.tipo = activo.nombre_tipo;
        // detalles técnicos
        this.largo = activo.largo;
        this.alturaTrabajo = activo.altura_trabajo;
        this.alto = activo.alto;
        this.cargaMax = activo.carga_maxima;
        this.ancho = activo.ancho;
        this.peso = activo.peso;
        this.inclinacionFrontal = activo.inclinacion_frontal;
        this.inclinacionLateral = activo.inclinacion_lateral;

        // motor diésel
        this.motorDiesel = activo.motor_diesel;

        this.telefonos = data.telefonos_empresa || {};
      },
      error: (err: any) => {
        console.error('❌ Error cargando activo:', err);
      }
    });
  }

  cargarBotones(): void {
    this.apiService.getBotonesByActivoId(this.activoId).subscribe({
      next: (data: any) => {
        this.acciones = data.botones || [];
      },
      error: (err) => {
        console.error('❌ Error cargando botones:', err);
      }
    });
  }

  get visibleAcciones() {
    return this.expandir ? this.acciones : this.acciones.slice(0, this.maxVisible);
  }

  toggleExpand() {
    this.expandir = !this.expandir;
  }
}
