import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { HumConfiguracionProvision } from '@interfaces/comunes/humano/hum-configuracion-lista.interface';
import { ProvisionService } from '@modulos/humano/servicios/provision.service';
import { TranslateModule } from '@ngx-translate/core';
import { CuentasComponent } from '../../../../../../comun/componentes/cuentas/cuentas.component';
import { RegistroAutocompletarConCuenta } from '@interfaces/comunes/autocompletar/contabilidad/con-cuenta.interface';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-provision-lista',
  templateUrl: './provision-lista.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CuentasComponent,
  ],
})
export class ProvisionListaComponent
  extends General
  implements OnInit, OnDestroy
{
  private _generalService = inject(GeneralService);
  private _provisionService = inject(ProvisionService);
  public provisiones = signal<HumConfiguracionProvision[]>([]);

  constructor() {
    super();
  }

  ngOnInit() {
    this._getConceptos();
  }

  ngOnDestroy(): void {}

  private _getConceptos() {
    this._generalService
      .consultaApi<RespuestaApi<HumConfiguracionProvision>>(
        'humano/configuracion_provision/',
        {
        limit: 1000,
        ordering: 'orden',
      })
      .subscribe((respuesta) => {
        this.provisiones.set(respuesta.results);
      });
  }

  onCambioDeCuenta(
    cuenta: RegistroAutocompletarConCuenta,
    cuentaId: number,
    campoNombre: 'cuenta_credito' | 'cuenta_debito',
  ) {
    this._provisionService
      .actualizarProvision(cuentaId, {
        [campoNombre]: cuenta.id,
      })
      .subscribe(() => {
        this._getConceptos();
        this.alertaService.mensajaExitoso('Se actualizo con exito!');
      });
  }

  mostrarCuentaCredito(provisionNombre: string) {
    const provisiones = ['PENSION', 'SALUD', 'CAJA', 'RIESGO', 'SENA', 'ICBF'];

    return !provisiones.includes(provisionNombre);
  }
}
