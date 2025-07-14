import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { NominaElectronicaNomina } from '@modulos/humano/interfaces/nomina-electronica.interface';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-nomina-electronica-tabla-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nomina-electronica-tabla-detalle.component.html',
  styleUrl: './nomina-electronica-tabla-detalle.component.css',
})
export class NominaElectronicaTablaDetalleComponent implements OnInit { 
  @Input() documentoId: number = 0;

  private generalService = inject(GeneralService);

  public nominaDetalles = signal<NominaElectronicaNomina[]>([]);

  ngOnInit(): void {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.generalService.consultaApi<RespuestaApi<NominaElectronicaNomina>>(
      `general/documento_detalle/`,
      {
        documento_id: this.documentoId,
        serializador: 'nomina',
      },
    ).subscribe((respuesta) => {
      this.nominaDetalles.set(respuesta.results);
    });
  }
}
