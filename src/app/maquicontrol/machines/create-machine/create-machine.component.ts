import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-machine',
  templateUrl: './create-machine.component.html',
  styleUrl: './create-machine.component.scss'
})
export class CreateMachineComponent implements OnInit {
  machineForm!: FormGroup;
  isEditMode = false;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  categorias: any[] = [];
  tipos: any[] = [];
  tiposFiltrados: any[] = [];

  imagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.machineForm = this.fb.group({
      id_tipo: [''],
      id_categoria: [''],
      marca: [''],
      modelo: [''],
      num_serie: [''],
      num_parque: [''],
      matricula: [''],
      tipo_motor: ['']
    });

    this.loadCategorias();
    this.loadTipos();

    this.machineForm.get('id_categoria')?.valueChanges.subscribe((catId: number) => {
      this.tiposFiltrados = this.tipos.filter(tipo => tipo.id_categoria === catId);
      this.machineForm.get('id_tipo')?.setValue('');
    });
  }

  loadCategorias() {
    this.http.get<any[]>('https://maquicontrol-90a19.ew.r.appspot.com/api/categorias')
      .subscribe(data => this.categorias = data);
  }

  loadTipos() {
    this.http.get<any[]>('https://maquicontrol-90a19.ew.r.appspot.com/api/tipoactivo')
      .subscribe(data => this.tipos = data);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Solo se permiten imágenes JPG, JPEG o PNG');
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.machineForm.valid) {
      const form = this.machineForm.value;
      const formData = new FormData();
      formData.append('id_tipo', form.id_tipo);
      formData.append('id_empresa', '2'); // fijo, según ejemplo
      formData.append('num_serie', form.num_serie);
      formData.append('num_parque', form.num_parque);
      formData.append('matricula', form.matricula);
      formData.append('marca', form.marca);
      formData.append('tipo_motor', form.tipo_motor);
      formData.append('modelo', form.modelo);
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      }

      this.http.post('https://maquicontrol-90a19.ew.r.appspot.com/api/activos/create', formData)
        .subscribe({
          next: res => console.log('✅ Éxito:', res),
          error: err => console.error('❌ Error:', err)
        });
    }
  }


}
