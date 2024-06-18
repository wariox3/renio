import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { FechasService } from '@comun/services/fechas.service';
import { Consumo } from '@interfaces/contenedor/consumo';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';

import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'app-contenedor-facturacion',
  templateUrl: './contenedor-facturacion.component.html',
  styleUrls: ['./contenedor-facturacion.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbAccordionModule,
    TranslateModule,
    CountUpModule
]
})
export class ContenedorFacturacionComponent extends General implements OnInit {
  resumenMes: string;

  contenedor_id: string | null;

  consumo: Consumo = {
    vr_plan: 0,
    vr_total: 0,
    consumosPlan: [],
  };

  constructor(
    private contenedorService: ContenedorService,
    public fechasServices: FechasService
  ) {
    super();
  }

  ngOnInit() {
    this.activatedRoute.parent?.paramMap.subscribe((params) => {
      this.contenedor_id = params.get('codigocontenedor');
    });
    this.consultarConsumoFecha();
    this.fechasServices.obtenerResumenMesHastaFecha().subscribe((mensaje) => {
      this.resumenMes = mensaje;
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarConsumoFecha() {
    if (this.contenedor_id) {
      this.contenedorService
        .consultarConsumoFecha(this.contenedor_id)
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
