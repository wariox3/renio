import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarHumConceptoCuenta } from '@interfaces/comunes/autocompletar/humano/hum-concepto-cuenta.interface';
import { Concepto } from '@modulos/contenedor/interfaces/concepto.interface';
import { DocumentoTipo } from '@modulos/empresa/interfaces/documento-tipo.interface';
import { ConceptoService } from '@modulos/humano/servicios/concepto.service';
import { TranslateModule } from '@ngx-translate/core';
import { CuentasComponent } from "../../../../../../comun/componentes/cuentas/cuentas.component";

@Component({
  selector: 'app-provision-lista',
  templateUrl: './provision-lista.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CuentasComponent
],
})
export class ProvisionListaComponent
  extends General
  implements OnInit, OnDestroy
{
  private _generalService = inject(GeneralService);
  private _conceptoService = inject(ConceptoService);

  arrDocumentosTipos: DocumentoTipo[] = [];
  resolucionId: number;
  documentoTipoSeleccionado: any;
  cuentaCobrarCodigo: string = '';
  cuentaCobrarNombre: string = '';
  formularioConceptoCuenta: FormGroup;
  public conceptosLista = signal<Concepto[]>([]);
  public cuentaConceptoLista = signal<RegistroAutocompletarHumConceptoCuenta[]>(
    [],
  );
  public conceptoSelecionado: Concepto;

  constructor() {
    super();
  }

  ngOnInit() {
    this._getConceptos();
  }

  ngOnDestroy(): void {}

  private _getConceptos() {
    this._generalService
      .consultarDatosAutoCompletar<Concepto>({
        limite: 1000,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'HumConfiguracionProvision',
      })
      .subscribe((respuesta) => {
        this.conceptosLista.set(respuesta.registros);
      });
  }

  onCambioDeCuenta(cuenta: any, cuentaConceptoId: number) {
    this._conceptoService
      .actualizarConceptoCuenta(cuentaConceptoId, {
        cuenta: cuenta.cuenta_id,
      })
      .subscribe(() => {
        this.alertaService.mensajaExitoso('Se actualizo con exito!');
      });
  }
}
