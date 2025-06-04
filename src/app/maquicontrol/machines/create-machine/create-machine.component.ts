import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-machine',
  templateUrl: './create-machine.component.html',
  styleUrl: './create-machine.component.scss'
})
export class CreateMachineComponent {
  machineForm!: FormGroup;
  isEditMode = false;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.machineForm = this.fb.group({
      categoria: [''],
      tipo: [''],
      marca: [''],
      modelo: [''],
      num_serie: [''],
      num_parque: [''],
      matricula: [''],
    });
  }

  /** Llenar formulario con datos para edición */
  loadMachine(machine: any): void {
    this.isEditMode = true;
    this.machineForm.patchValue({
      categoria: machine.categoria,
      tipo: machine.tipo,
      marca: machine.marca,
      modelo: machine.modelo,
      num_serie: machine.num_serie,
      num_parque: machine.num_parque,
      matricula: machine.matricula,
    });
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFileName = file.name;
      this.selectedFile = file;
      console.log('Archivo seleccionado:', file.name);
    }
  }

  onSubmit(): void {
    if (this.machineForm.valid) {
      const formData = { ...this.machineForm.value, file: this.selectedFile };
      if (this.isEditMode) {
        console.log('Actualizando máquina:', formData);
      } else {
        console.log('Creando nueva máquina:', formData);
      }
    }
  }
}
