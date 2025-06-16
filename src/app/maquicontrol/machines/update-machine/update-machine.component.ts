import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-update-machine',
  templateUrl: './update-machine.component.html',
  styleUrl: './update-machine.component.scss'
})
export class UpdateMachineComponent implements OnInit {
  machineForm!: FormGroup;
  tipoMotor: 'electrico' | 'diesel' = 'electrico';
  selectedFileName: string = '';
  selectedFile: File | null = null;
  imageUrl: string | null = null;

  machineId!: number;
  categorias: any[] = [];
  selectedCategoriaNombre: string = '';
  tipoActivo: any[] = [];
  selectedTipoActivo: string = '';

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.api.getCategorias().subscribe((res) => {
      this.categorias = res;
    });

    this.api.getTipoActivo().subscribe((res) => {
      this.tipoActivo = res;
    });

    this.machineForm = this.fb.group({
      marca: [''],
      modelo: [''],
      num_serie: [''],
      num_parque: [''],
      anio_fabricacion: [''],
      peso: [''],
      altura_trabajo: [''],
      max_carga: [''],
      matricula: [''],
      alto: [''],
      ancho: [''],
      largo: [''],
      nombre_categoria: [''],
      nombre_tipo: [''],
      incl_frontal: [''],
      incl_lateral: [''],

      // Batería
      bateria_modelo: [''],
      bateria_voltaje: [''],
      bateria_amperaje: [''],
      bateria_cantidad: [''],
      bateria_alto: [''],
      bateria_ancho: [''],
      bateria_largo: [''],

      // Cargador
      cargador_voltaje: [''],
      cargador_amperaje: [''],
      cargador_potencia: [''],
      cargador_alto: [''],
      cargador_ancho: [''],
      cargador_largo: [''],

      // Motor diésel
      diesel_marca: [''],
      diesel_modelo: [''],
      diesel_potencia: [''],
      diesel_cilindrada: [''],
      diesel_voltaje: [''],
      diesel_deposito: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.machineId = +id;
      this.loadMachine(this.machineId);
    }
  }

  getCategoriaIdByNombre(nombre: string): string | null {
    const categoria = this.categorias.find(cat => cat.nombre === nombre);
    return categoria ? categoria.nombre : null;
  }

  getTipoActivoByNombre(nombre: string): string | null {
    const tipoActivo = this.tipoActivo.find(cat => cat.nombre === nombre);
    return tipoActivo ? tipoActivo.nombre : null;
  }

  loadMachine(id: number): void {
    this.api.getById(id).subscribe((res) => {
      const activo = res.activo;
      const motorDiesel = activo.motor_diesel || res.motor_diesel;

      this.selectedCategoriaNombre = activo.nombre_categoria;
      this.tipoMotor = activo.tipo_motor?.toLowerCase() === 'diesel' ? 'diesel' : 'electrico';

      this.machineForm.patchValue({
        ...activo,
        diesel_marca: motorDiesel?.marca || '',
        diesel_modelo: motorDiesel?.modelo || '',
        diesel_cilindrada: motorDiesel?.cilindrada || '',
        diesel_voltaje: motorDiesel?.voltaje_sistema || '',
        diesel_deposito: motorDiesel?.deposito || '',
        nombre_categoria: this.getCategoriaIdByNombre(activo.nombre_categoria),
        nombre_tipo: this.getTipoActivoByNombre(activo.nombre_tipo)
      });

      if (activo.imagen) {
        this.imageUrl = activo.imagen;
        this.selectedFileName = activo.imagen;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.machineForm.valid) {
      const raw = this.machineForm.value;

      const payload = {
        activo: {
          id: this.machineId,
          marca: raw.marca,
          modelo: raw.modelo,
          num_serie: raw.num_serie,
          num_parque: raw.num_parque,
          anio_fabricacion: raw.anio_fabricacion,
          peso: raw.peso,
          referencia: raw.referencia || '',
          altura_trabajo: raw.altura_trabajo,
          max_carga: raw.max_carga,
          contacto: null,
          intervalo_mantenimiento: null,
          km_recorrido: null,
          horas: null,
          vencimiento_itv: null,
          vencimiento_seguro: null,
          matricula: raw.matricula,
          alto: raw.alto,
          ancho: raw.ancho,
          largo: raw.largo,
          tipo_motor: this.tipoMotor,
          id_tipo: 85,
          id_empresa: 2,
          incl_lateral: raw.incl_lateral,
          incl_frontal: raw.incl_frontal,
          nombre_categoria: raw.nombre_categoria,
          nombre_tipo: raw.nombre_tipo,
          imagen: raw.imagen || ''
        },
        motor: {
          id: raw.motor_id || null,
          marca: raw.diesel_marca,
          modelo: raw.diesel_modelo,
          cilindrada: raw.diesel_cilindrada,
          voltaje_sistema: raw.diesel_voltaje,
          deposito: raw.diesel_deposito,
          activo_id: this.machineId
        }
      };

      this.api.update(this.machineId, payload).subscribe(() => {
        console.log('Máquina actualizada');

        if (this.selectedFile) {
          const imgData = new FormData();
          imgData.append('imagen', this.selectedFile);

          this.api.uploadImagen(this.machineId, imgData).subscribe(
            response => {
              console.log('Respuesta del backend:', response);

              //this.router.navigate(['/webproducto']);
            },
            error => {
              console.error('Error al subir imagen:', error);
            }
          );
        } else {
          this.router.navigate(['/machines']);
        }
      });
    } else {
      this.machineForm.markAllAsTouched();
    }
  }

  uploadOnlyImage(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('imagen', this.selectedFile);
    console.log(formData, "FILE")

    this.api.uploadImagen(this.machineId, formData).subscribe({
      next: (res) => {
        console.log('Respuesta imagen:', res);
        if (res?.activo?.imagen) {
          this.selectedFileName = res.activo.imagen;
        }
        //this.router.navigate(['/machines']);
      },
      error: (err) => {
        console.error('Error subiendo imagen:', err.message);
        // Mostrar notificación al usuario si querés
      }
    });
  }

  get getFileName(): string {
    return this.selectedFile?.name || this.selectedFileName?.split('/').pop()?.split('?')[0] || '';
  }

  // Campos reutilizados
  generalFields = [
    { name: 'marca', label: 'Marca' },
    { name: 'modelo', label: 'Modelo' },
    { name: 'num_serie', label: 'Número de serie' },
    { name: 'num_parque', label: 'Número de Parque' },
    { name: 'anio_fabricacion', label: 'Año de Fabricación' },
    { name: 'peso', label: 'Peso (kg)' },
    { name: 'altura_trabajo', label: 'Altura de Trabajo (m)' },
    { name: 'max_carga', label: 'Máxima Carga (kg)' },
    { name: 'matricula', label: 'Matrícula' },
    { name: 'alto', label: 'Alto (m)' },
    { name: 'ancho', label: 'Ancho (m)' },
    { name: 'largo', label: 'Largo (m)' },
    { name: 'incl_frontal', label: 'Incl. Frontal' },
    { name: 'incl_lateral', label: 'Incl. Lateral' },
  ];

  bateriaFields = [
    { name: 'bateria_modelo', label: 'Modelo' },
    { name: 'bateria_voltaje', label: 'Voltaje (V)' },
    { name: 'bateria_amperaje', label: 'Amperaje (Ah)' },
    { name: 'bateria_cantidad', label: 'Cantidad' },
    { name: 'bateria_alto', label: 'Alto (cm)' },
    { name: 'bateria_ancho', label: 'Ancho (cm)' },
    { name: 'bateria_largo', label: 'Largo (cm)' },
  ];

  cargadorFields = [
    { name: 'cargador_voltaje', label: 'Voltaje (V)' },
    { name: 'cargador_amperaje', label: 'Amperaje (A)' },
    { name: 'cargador_potencia', label: 'Potencia (W)' },
    { name: 'cargador_alto', label: 'Alto (cm)' },
    { name: 'cargador_ancho', label: 'Ancho (cm)' },
    { name: 'cargador_largo', label: 'Largo (cm)' },
  ];

  dieselFields = [
    { name: 'diesel_marca', label: 'Marca' },
    { name: 'diesel_modelo', label: 'Modelo' },
    { name: 'diesel_cilindrada', label: 'Cilindrada' },
    { name: 'diesel_voltaje', label: 'Voltaje' },
    { name: 'diesel_deposito', label: 'Depósito' },
  ];
}
