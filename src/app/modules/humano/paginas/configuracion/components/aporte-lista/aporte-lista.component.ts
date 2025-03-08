import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarConCuenta } from '@interfaces/comunes/autocompletar/contabilidad/con-cuenta.interface';
import { HumConfiguracionAporte } from '@interfaces/comunes/humano/hum-configuracion-lista.interface';
import { ProvisionService } from '@modulos/humano/servicios/provision.service';
import { TranslateModule } from '@ngx-translate/core';
import { CuentasComponent } from '../../../../../../comun/componentes/cuentas/cuentas.component';
import { AporteService } from '@modulos/humano/servicios/aporte.service';

@Component({
  selector: 'app-aporte-lista',
  templateUrl: './aporte-lista.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CuentasComponent,
  ],
})
export class AporteListaComponent extends General implements OnInit, OnDestroy {
  private _generalService = inject(GeneralService);
  private _aporteService = inject(AporteService);
  public provisiones = signal<HumConfiguracionAporte[]>([]);

  constructor() {
    super();
  }

  ngOnInit() {
    this._getConceptos();
  }

  ngOnDestroy(): void {}

  private _getConceptos() {
    this._generalService
      .consultarDatosAutoCompletar<HumConfiguracionAporte>({
        limite: 1000,
        desplazar: 0,
        ordenamientos: ['orden'],
        limite_conteo: 10000,
        modelo: 'HumConfiguracionAporte',
      })
      .subscribe((respuesta) => {
        this.provisiones.set(respuesta.registros);
      });
  }

  onCambioDeCuenta(cuenta: RegistroAutocompletarConCuenta, cuentaId: number) {
    this._aporteService
      .actualizarAporte(cuentaId, {
        cuenta: cuenta.cuenta_id,
      })
      .subscribe(() => {
        this._getConceptos();
        this.alertaService.mensajaExitoso('Se actualizo con exito!');
      });
  }
}
