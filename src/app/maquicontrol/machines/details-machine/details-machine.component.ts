import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-details-machine',
  templateUrl: './details-machine.component.html',
  styleUrl: './details-machine.component.scss'
})
export class DetailsMachineComponent implements OnInit {
  machine: any;
  technicalSpecs: any[] = [];
  documentation: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchMachine(+id);
    }
  }

  fetchMachine(id: number): void {
    const url = `https://maquicontrol-90a19.ew.r.appspot.com/api/activosPriv/${id}`;
    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.machine = data;
        this.mapSections();
      },
      error: (err) => {
        console.error('Error al obtener el activo:', err);
      }
    });
  }

  mapSections(): void {
    const activo = this.machine.activo;
    this.technicalSpecs = [
      { label: 'Altura de trabajo', value: activo.altura_trabajo, unit: 'Mts.' },
      { label: 'Peso', value: activo.peso, unit: 'Kg' },
      { label: 'Carga máxima', value: activo.max_carga, unit: 'Kg' },
      { label: 'Intervalo mantenimiento', value: activo.intervalo_mantenimiento, unit: '' },
      { label: 'Horas de uso', value: activo.horas, unit: '' },
      { label: 'Kilómetros', value: activo.km_recorrido, unit: '' },
    ];

    this.documentation = [
      { label: 'Vencimiento ITV', value: activo.vencimiento_itv },
      { label: 'Vencimiento seguro', value: activo.vencimiento_seguro },
    ];
  }

  verMultimedia(): void {
    this.router.navigate(['/machines', this.machine.activo.id, 'multimedia']);
  }

  verBotones(): void {
    this.router.navigate(['/machines', this.machine.activo.id, 'botones']);
  }

  generarQR(): void {
    console.log('Generando QR para', this.machine.activo.id);
  }

  eliminar(): void {
    if (confirm('¿Estás seguro de eliminar este activo?')) {
      // Aquí iría la lógica para eliminar
      // this.http.delete(...).subscribe(...)
    }
  }
}
