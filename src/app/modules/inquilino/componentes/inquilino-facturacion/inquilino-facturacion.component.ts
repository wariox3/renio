import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { FechasService } from '@comun/services/fechas.service';
import {
  Consumo,
  InquilinoService,
} from '@modulos/inquilino/servicios/inquilino.service';

@Component({
  selector: 'app-inquilino-facturacion',
  templateUrl: './inquilino-facturacion.component.html',
  styleUrls: ['./inquilino-facturacion.component.scss'],
})
export class InquilinoFacturacionComponent extends General implements OnInit {
  resumenMes: string;

  inquilino_id: string | null;

  consumo: Consumo = {
    vr_plan: 0,
    vr_total: 0,
    consumosPlan: [],
  };

  constructor(
    private inquilinoService: InquilinoService,
    public fechasServices: FechasService
  ) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.parent?.paramMap.subscribe((params) => {
      this.inquilino_id = params.get('codigoinquilino');
    });
    this.consultarConsumoFecha();
    this.fechasServices.obtenerResumenMesHastaFecha().subscribe((mensaje) => {
      this.resumenMes = mensaje;
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarConsumoFecha() {
    if (this.inquilino_id) {
      this.inquilinoService
        .consultarConsumoFecha(this.inquilino_id)
        .subscribe((respuesta: any) => {
          // Llenar el objeto consumo con los valores de la respuesta
          this.consumo.vr_plan = respuesta.consumos.vr_plan | 0;
          this.consumo.vr_total = respuesta.consumos.vr_total | 0;

          // Si la respuesta tiene un arreglo de consumosPlan
          if (respuesta.consumosPlan && respuesta.consumosPlan.length > 0) {
            // Llenar el objeto consumosPlan con todos los elementos del arreglo
            this.consumo.consumosPlan = respuesta.consumosPlan.map(
              (consumoPlan: any) => ({
                plan_id: consumoPlan.plan_id,
                vr_plan: consumoPlan.vr_plan,
                vr_total: consumoPlan.vr_total,
                plan_nombre: consumoPlan.plan_nombre,
              })
            );
          }

          this.changeDetectorRef.detectChanges();
        });
    }
  }
}
