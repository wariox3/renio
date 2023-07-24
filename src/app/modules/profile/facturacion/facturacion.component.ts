import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { Factura, ResumenService, Consumo } from '../services/resumen.service';
import { zip } from 'rxjs';
import { FechasService } from '@comun/services/fechas.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
})
export class FacturacionComponent extends General implements OnInit {
  codigoUsuario = '';
  facturas: Factura[] = [];
  consumos: Consumo = {
    vr_plan: 0,
    vr_total: 0,
  };

  constructor(private resumenService: ResumenService, public fechaServices: FechasService) {
    super();
  }

  ngOnInit(): void {
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
    this.consultarInformacion();
  }

  consultarInformacion() {
    zip(
      this.resumenService.facturacion(this.codigoUsuario),
      this.resumenService.facturacionFechas(this.codigoUsuario)
    ).subscribe((respuesta) => {
      this.facturas = respuesta[0].movimientos;
      this.consumos = respuesta[1].consumos;
      this.changeDetectorRef.detectChanges();
    });
  }
}
