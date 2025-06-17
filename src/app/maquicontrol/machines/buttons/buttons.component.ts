import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { ButtonFilesComponent } from './button-files.component';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog.component';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
  activoId!: number;

  buttonsList: any[] = [];
  botonForm: FormGroup;
  selectedCategory = 'All';
  materialIcons: string[] = [
    'edit', 'delete_forever', 'folder_open', 'check', 'add', 'search', 'home', 'settings', 'star', 'info'
  ];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.botonForm = this.fb.group({
      nombre: ['', Validators.required],
      texto: ['', Validators.required],
      estilo: [''],
      icono: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.activoId = +id;
        this.loadButtons(this.activoId);
      } else {
        console.warn('No se encontró el parámetro "id" en la ruta.');
      }
    });
  }

  loadButtons(activoId: number): void {
    this.apiService.getBotonesByActivoId(activoId).subscribe({
      next: (data: any) => {
        this.buttonsList = data.botones;
      },
      error: (err) => {
        console.error('❌ Error al obtener botones:', err);
      }
    });
  }

  openDialog(boton?: any): void {
    const dialogRef = this.dialog.open(CreateButtonModalComponent, {
      width: '400px',
      data: {
        ...boton,
        id_activo: this.activoId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.buttonsList.findIndex(b => b.id === result.id);
        if (index !== -1) {
          this.buttonsList[index] = result;
        } else {
          this.buttonsList.push(result);
        }
      }
    });
  }


  openArchivosDialog(botonId: string): void {
    this.dialog.open(ButtonFilesComponent, {
      width: '1000px',
      maxWidth: '105vw',
      data: { botonId, activoId: this.activoId }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.buttonsList = this.filter(filterValue);
  }

  filter(v: string): any[] {
    return this.buttonsList.filter((x) =>
      x.nombre.toLowerCase().includes(v.toLowerCase())
    );
  }

  ddlChange(ob: any): void {
    const filterValue = ob.value;
    if (filterValue === 'All') {
      this.loadButtons(this.activoId);
    } else {
      this.buttonsList = this.buttonsList.filter(
        (b) => b.estilo === filterValue
      );
    }
  }

  eliminarBoton(boton: any): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '360px',
      data: { nombre: boton.nombre }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result === true) {
        this.apiService.deleteBoton(boton.id).subscribe({
          next: () => {
            this.buttonsList = this.buttonsList.filter((b: { id: any; }) => b.id !== boton.id);
            console.log(`✅ Botón ${boton.nombre} eliminado`);
          },
          error: (err) => {
            console.error('❌ Error al eliminar el botón:', err);
          }
        });
      }
    });
  }
}

@Component({
  selector: 'app-create-button-modal',
  templateUrl: 'create-button-modal.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class CreateButtonModalComponent implements OnInit {
  materialIcons: string[] = [
    'edit', 'delete_forever', 'folder_open', 'check', 'add', 'search', 'home', 'settings', 'star', 'info'
  ];
  form: FormGroup;
  buttonsList: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateButtonModalComponent>,
    private fb: FormBuilder,
    private apiService: ApiService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [this.data?.nombre || '', Validators.required],
      texto: [this.data?.texto || '', Validators.required],
      estilo: [this.data?.estilo || 'btn-outline-primary', Validators.required],
      icono: [this.data?.icono || '']
    });
  }

  guardarBoton(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

      const payload = {
        ...formValue,
        id_activo: this.data?.id_activo
      };

      if (this.data?.id) {
        this.apiService.updateBoton(this.data.id, payload).subscribe({
          next: (response) => {
            this.dialogRef.close(response); // enviamos botón actualizado al padre
          },
          error: (err) => {
            console.error('❌ Error al actualizar botón:', err);
          }
        });
      } else {
        this.dialogRef.close(payload);
      }
    }
  }



}
