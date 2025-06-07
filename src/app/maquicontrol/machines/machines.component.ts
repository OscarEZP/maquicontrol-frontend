import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { ApiService } from '../../services/api.service';

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

const machines: MachineElement[] = [];

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

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getMachines().subscribe((data) => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
