import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-machine',
  templateUrl: './update-machine.component.html',
  styleUrl: './update-machine.component.scss'
})
export class UpdateMachineComponent implements OnInit {
  machineForm!: FormGroup;
  tipoMotor: 'electrico' | 'diesel' = 'electrico'; // valor por defecto
  selectedFileName: string = '';
  selectedFile: File | null = null;
  machineId!: number;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    //private maquinaService: MaquinaService
  ) {}

  ngOnInit(): void {
    this.machineForm = this.fb.group({
      // Campos generales
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
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.machineId = +id;
      this.loadMachine(this.machineId);
    }
  }

  // Cargar data por ID
  loadMachine(id: number): void {
    /*this.maquinaService.getById(id).subscribe((machine) => {
      this.tipoMotor = machine.tipo_motor?.toLowerCase() === 'diesel' ? 'diesel' : 'electrico';
      this.machineForm.patchValue(machine);
    });*/
  }

  // Cargar archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.selectedFileName = file.name;
      this.selectedFile = file;
    }
  }

  // Enviar datos
  onSubmit(): void {
    if (this.machineForm.valid) {
      const formData = this.machineForm.value;

      // Puedes agregar el archivo a FormData si necesitas subirlo
      if (this.selectedFile) {
        formData.imagen = this.selectedFile;
      }

      /*this.maquinaService.update(this.machineId, formData).subscribe(() => {
        console.log('Máquina actualizada');
        this.router.navigate(['/machines']);
      });*/
    } else {
      this.machineForm.markAllAsTouched();
    }
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
    { name: 'diesel_potencia', label: 'Potencia (HP)' },
  ];
}
