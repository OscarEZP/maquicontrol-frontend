import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';

export interface MachineElement {
  id: number;
  marca: string;
  modelo: string;
  matricula: string;
  num_parque: string;
  tipo_motor: string;
  imagen: string;
  anio_fabricacion?: number | null;
  num_serie: string;
  referencia: string;
  id_empresa: number;
  nombre_empresa: string;
}

const machines: MachineElement[] = [
  {
    id: 14,
    marca: "Jaguar",
    modelo: "Fiesta",
    matricula: "123QWEQ",
    num_parque: "3425454",
    tipo_motor: "electrico",
    imagen: "https://storage.googleapis.com/maquicontrol-90a19.firebasestorage.app/imgActivos/Icon.png?GoogleAccessId=maquicontrol-90a19%40appspot.gserviceaccount.com&Expires=1748286730&Signature=...",
    anio_fabricacion: null,
    num_serie: "1433543",
    referencia: "imgActivos/Icon.png",
    id_empresa: 2,
    nombre_empresa: "Empresa Prueba"
  }
];

@Component({
  selector: 'app-machines',
  templateUrl: './machines.component.html',
  styleUrls: ['./machines.component.scss']
})
export class MachinesComponent implements OnInit {
  @ViewChild(MatTable, { static: true }) table: MatTable<any> = Object.create(null);
  searchText: string = '';
  dataSource = new MatTableDataSource(machines);

  displayedColumns: string[] = [
    'id',
    'marca_modelo',
    'empresa',
    'matricula',
    'num_parque',
    'num_serie',
    'accion'
  ];

  constructor() {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(machines);
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
