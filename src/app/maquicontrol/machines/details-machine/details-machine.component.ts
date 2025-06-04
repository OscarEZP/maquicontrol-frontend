import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-details-machine',
  templateUrl: './details-machine.component.html',
  styleUrl: './details-machine.component.scss'
})
export class DetailsMachineComponent implements OnInit {
  machine: any = {
    "message": "Informaci\u00f3n de Activo encontrada",
    "activo": {
        "id": 13,
        "marca": "Jaguar",
        "modelo": "Malte",
        "num_serie": "fewt34t",
        "num_parque": "4545",
        "anio_fabricacion": null,
        "peso": null,
        "imagen": null,
        "referencia": null,
        "altura_trabajo": null,
        "max_carga": null,
        "contacto": null,
        "intervalo_mantenimiento": null,
        "km_recorrido": null,
        "horas": null,
        "vencimiento_itv": null,
        "vencimiento_seguro": null,
        "matricula": "123QWEQ",
        "alto": null,
        "ancho": null,
        "largo": null,
        "tipo_motor": "diesel",
        "id_motor_diesel": 5,
        "id_motor_electrico": null,
        "id_tipo": 117,
        "id_empresa": 2,
        "created_at": "2025-05-19 14:29:22",
        "updated_at": "2025-05-19 14:29:22",
        "nombre_empresa": "Empresa Prueba",
        "nombre_tipo": "APILADOR",
        "nombre_categoria": "CARRETILLAS",
        "motor_diesel": {
            "id": 5,
            "marca": "hola",
            "modelo": "hola",
            "potencia": "100",
            "created_at": "2025-05-19T14:29:22.000000Z",
            "updated_at": "2025-05-19T14:29:22.000000Z"
        }
    },
    "motor_diesel": {
        "id": 5,
        "marca": "hola",
        "modelo": "hola",
        "potencia": "100",
        "created_at": "2025-05-19T14:29:22.000000Z",
        "updated_at": "2025-05-19T14:29:22.000000Z"
    }
};
  technicalSpecs: any = [];
  documentation: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    //private maquinaService: MaquinaService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.mapSections();
    if (id) {
      /*this.maquinaService.getById(+id).subscribe((data) => {
        this.machine = data;
        this.mapSections();
      });*/
    }
  }

  mapSections(): void {
    this.technicalSpecs = [
      { label: 'Altura de trabajo', value: this.machine.altura_trabajo, unit: 'Mts.' },
      { label: 'Peso', value: this.machine.peso, unit: 'Kg' },
      { label: 'Carga máxima', value: this.machine.max_carga, unit: 'Kg' },
      { label: 'Intervalo mantenimiento', value: this.machine.intervalo_mantenimiento, unit: '' },
      { label: 'Horas de uso', value: this.machine.horas_uso, unit: '' },
      { label: 'Kilómetros', value: this.machine.kilometros, unit: '' },
    ];

    this.documentation = [
      { label: 'Vencimiento ITV', value: this.machine.vencimiento_itv },
      { label: 'Vencimiento seguro', value: this.machine.vencimiento_seguro },
    ];
  }

  verMultimedia(): void {
    this.router.navigate(['/machines', this.machine.id, 'multimedia']);
  }

  verBotones(): void {
    this.router.navigate(['/machines', this.machine.id, 'botones']);
  }

  generarQR(): void {
    // lógica para generar QR
    console.log('Generando QR para', this.machine.id);
  }

  eliminar(): void {
    if (confirm('¿Estás seguro de eliminar este activo?')) {
      /*this.maquinaService.delete(this.machine.id).subscribe(() => {
        this.router.navigate(['/machines']);
      });*/
    }
  }
}
