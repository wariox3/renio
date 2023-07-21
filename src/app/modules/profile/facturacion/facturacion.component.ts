import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { Factura, ResumenService, facturas } from '../services/resumen.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
})
export class FacturacionComponent extends General implements OnInit {

  codigoUsuario = '';
  factura: Factura = {
    fecha: '',
    id: 0,
    tipo: '',
    vr_afectado: 0,
    vr_saldo: 0,
    vr_total: 0 
  }

  constructor(
    private resumenService: ResumenService,
  ) {
    super();
  }

  ngOnInit(): void {    
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
    this.consultarInformacion()
  }


  consultarInformacion() {
    this.resumenService.facturacion(this.codigoUsuario).subscribe(
      (respuesta: facturas) => { 
        this.factura = respuesta.movimientos[0]
      
        this.changeDetectorRef.detectChanges();
      },
    );
  }

}
