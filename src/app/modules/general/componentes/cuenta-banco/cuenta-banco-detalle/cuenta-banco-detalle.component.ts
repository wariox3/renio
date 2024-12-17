import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CuentaBancoService } from '@modulos/general/servicios/cuenta-banco.service';
import { TranslateModule } from '@ngx-translate/core';
import { TituloAccionComponent } from "../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-cuenta-banco-detalle',
  standalone: true,
  imports: [CommonModule, TranslateModule, BtnAtrasComponent, CardComponent, TituloAccionComponent],
  templateUrl: `./cuenta-banco-detalle.component.html`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CuentaBancoDetalleComponent
  extends General
  implements OnInit
{
  documento_banco = {
    nombre: '',
    numero_cuenta: '',
    cuenta_banco_tipo_id: '',
    cuenta_banco_tipo_nombre: '',
    cuenta_banco_clase: '',
    cuenta_banco_clase_id: '',
    cuenta_banco_clase_nombre:""
  };

  constructor(private cuentaBancoService: CuentaBancoService) {
    super();
  }

  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this.cuentaBancoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.documento_banco = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
