import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  template: `
    <h2 mat-dialog-title>¿Eliminar botón?</h2>
    <mat-dialog-content>
      ¿Estás seguro de que deseas eliminar el botón <strong>{{ data.nombre }}</strong>?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>No</button>
      <button mat-flat-button color="warn" (click)="confirmar()">Sí, eliminar</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>
  ) {}

  confirmar(): void {
    this.dialogRef.close(true);
  }
}
