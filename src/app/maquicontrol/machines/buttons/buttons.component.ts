import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { course } from 'src/app/pages/apps/courses/course';
import { CourseService } from 'src/app/pages/apps/courses/course.service';
import { ButtonFilesComponent } from './button-files.component';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss'
})
export class ButtonsComponent {
  buttonsList: any[] = [
    {
      "id": 84,
      "nombre": "Resto de Multimedia",
      "texto": "Resto de Multimedia",
      "estilo": "btn-outline-orange",
      "icono": "bi-file-earmark-fill",
      "id_activo": 13,
      "created_at": "2025-05-19T14:29:22.000000Z",
      "updated_at": "2025-05-19T14:29:22.000000Z"
    },
    {
      "id": 85,
      "nombre": "Manual de Operador",
      "texto": "Manual de Operador",
      "estilo": "btn-outline-orange",
      "icono": "bi-file-earmark-text-fill",
      "id_activo": 13,
      "created_at": "2025-05-19T14:29:22.000000Z",
      "updated_at": "2025-05-19T14:29:22.000000Z"
    },
    {
      "id": 86,
      "nombre": "Funciones de Mandos",
      "texto": "Funciones de Mandos",
      "estilo": "btn-outline-primary",
      "icono": "bi-dpad-fill",
      "id_activo": 13,
      "created_at": "2025-05-19T14:29:22.000000Z",
      "updated_at": "2025-05-19T14:29:22.000000Z"
    },
    {
      "id": 87,
      "nombre": "Certificado CE",
      "texto": "Certificado CE",
      "estilo": "btn-outline-primary",
      "icono": "bi-file-text-fill",
      "id_activo": 13,
      "created_at": "2025-05-19T14:29:22.000000Z",
      "updated_at": "2025-05-19T14:29:22.000000Z"
    },
    {
      "id": 88,
      "nombre": "C\u00f3digos de Error",
      "texto": "C\u00f3digos de Error",
      "estilo": "btn-outline-primary",
      "icono": "bi-exclamation-triangle-fill",
      "id_activo": 13,
      "created_at": "2025-05-19T14:29:22.000000Z",
      "updated_at": "2025-05-19T14:29:22.000000Z"
    },
    {
      "id": 89,
      "nombre": "Certificado Revisiones",
      "texto": "Certificado Revisiones",
      "estilo": "btn-outline-primary",
      "icono": "bi-file-earmark-ruled-fill",
      "id_activo": 13,
      "created_at": "2025-05-19T14:29:22.000000Z",
      "updated_at": "2025-05-19T14:29:22.000000Z"
    },
    {
      "id": 90,
      "nombre": "V\u00eddeos instructivos",
      "texto": "V\u00eddeos instructivos",
      "estilo": "btn-outline-primary",
      "icono": "bi-file-earmark-play-fill",
      "id_activo": 13,
      "created_at": "2025-05-19T14:29:22.000000Z",
      "updated_at": "2025-05-19T14:29:22.000000Z"
    },
    {
      "id": 91,
      "nombre": "Galer\u00eda de im\u00e1genes",
      "texto": "Galer\u00eda de im\u00e1genes",
      "estilo": "btn-outline-primary",
      "icono": "bi-images",
      "id_activo": 13,
      "created_at": "2025-05-19T14:29:22.000000Z",
      "updated_at": "2025-05-19T14:29:22.000000Z"
    },
    {
      "id": 92,
      "nombre": "Testigos indicadores",
      "texto": "Testigos indicadores",
      "estilo": "btn-outline-primary",
      "icono": "bi-radioactive",
      "id_activo": 13,
      "created_at": "2025-05-19T14:29:22.000000Z",
      "updated_at": "2025-05-19T14:29:22.000000Z"
    }
  ];
  selectedCategory = 'All';
  materialIcons: string[] = [
    'edit', 'delete_forever', 'folder_open', 'check', 'add', 'search', 'home', 'settings', 'star', 'info'
  ];
  botonForm: FormGroup;

  constructor(private courseService: CourseService, private dialog: MatDialog, private fb: FormBuilder) {
    this.buttonsList = this.buttonsList;
    this.botonForm = this.fb.group({
      nombre: ['', Validators.required],
      texto: ['', Validators.required],
      estilo: [''],
      icono: ['']
    });
  }

  openDialog(boton?: any): void {
    const dialogRef = this.dialog.open(CreateButtonModalComponent, {
      width: '400px',
      data: boton || null // si es edición, pasamos el objeto
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.buttonsList.findIndex(b => b.nombre === result.nombre);

        if (index !== -1) {
          // Editar botón existente
          this.buttonsList[index] = result;
        } else {
          // Crear nuevo botón
          this.buttonsList.push(result);
        }
      }
    });
  }

  openArchivosDialog(botonId: string) {
    this.dialog.open(ButtonFilesComponent, {
      width: '1000px', // o usa '90vw' para un tamaño responsivo basado en el ancho de la pantalla
      maxWidth: '105vw',
      data: { botonId }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.buttonsList = this.filter(filterValue);
  }

  filter(v: string): course[] {
    return this.buttonsList
      .filter((x) => x.nombre.toLowerCase().indexOf(v.toLowerCase()) !== -1);
  }

  ddlChange(ob: any): void {
    const filterValue = ob.value;
    if (filterValue === 'All') {
      this.buttonsList = this.buttonsList;
    } else {
      this.buttonsList = this.buttonsList
        // tslint:disable-next-line: no-shadowed-variable
        .filter((course: { courseFramework: any; }) => course.courseFramework === filterValue);
    }
    // this.todos.filter(course => course.courseType==filterValue);
  }
}

@Component({
  selector: 'app-create-button-modal',
  templateUrl: 'create-button-modal.component.html',
  styleUrl: './buttons.component.scss'

})
export class CreateButtonModalComponent {
  materialIcons: string[] = [
    'edit', 'delete_forever', 'folder_open', 'check', 'add', 'search', 'home', 'settings', 'star', 'info'
  ];
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateButtonModalComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [this.data?.nombre || '', Validators.required],
      texto: [this.data?.texto || '', Validators.required],
      estilo: [this.data?.estilo || 'blue', Validators.required],
      icono: [this.data?.icono || '']
    });
  }

  guardarBoton(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

}
