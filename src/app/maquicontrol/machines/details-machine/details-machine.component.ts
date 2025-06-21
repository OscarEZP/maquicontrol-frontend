import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-details-machine',
  templateUrl: './details-machine.component.html',
  styleUrls: ['./details-machine.component.scss']
})
export class DetailsMachineComponent implements OnInit {
  machine: any;
  technicalSpecs: any[] = [];
  documentation: any[] = [];
  logo2: string = './assets/logo2.png';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private api: ApiService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadingService.show();
      this.fetchMachine(+id);
    }
  }

  fetchMachine(id: number): void {
    this.api.getMachine(id)
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
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

  async generarQR(format: 'png' | 'pdf' | 'svg' = 'png'): Promise<void> {
    const activo = this.machine?.activo;
    if (!activo) {
      console.error('No hay datos del activo para generar QR');
      return;
    }

    try {
      const qrData = this.api.generateQRData(activo); // genera la URL
      await this.api.generateAndDownloadQR(
        qrData,
        `qr-activo-${activo.id}`,
        format,
        this.logo2,
        activo
      );
    } catch (error) {
      console.error('Error al generar o descargar el QR:', error);
    }
  }

  eliminar(): void {
    if (confirm('¿Estás seguro de eliminar este activo?')) {
      // Aquí iría la lógica para eliminar
      // this.http.delete(...).subscribe(...)
    }
  }
}
