import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import {
  Consumo,
  EmpresaService,
  consumos,
} from '@modulos/empresa/servicios/empresa.service';

@Component({
  selector: 'app-empresa-facturacion',
  templateUrl: './empresa-facturacion.component.html',
  styleUrls: ['./empresa-facturacion.component.scss'],
})
export class EmpresaFacturacionComponent extends General implements OnInit {
  empresa_id = this.activatedRoute.snapshot.paramMap.get('codigoempresa')!;

  consumo: Consumo = {
    vr_plan: 0,
    vr_total: 0,
  };

  constructor(private empresaService: EmpresaService) {
    super();
  }

  ngOnInit() {
    this.consultarConsumoFecha();
    this.changeDetectorRef.detectChanges();
  }

  consultarConsumoFecha() {
    this.empresaService
      .consultarConsumoFecha(this.empresa_id)
      .subscribe((respuesta: consumos) => {
        this.consumo = respuesta.consumos;
        this.changeDetectorRef.detectChanges();
      });
  }
}
