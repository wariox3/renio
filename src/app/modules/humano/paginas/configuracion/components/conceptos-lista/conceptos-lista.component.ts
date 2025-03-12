import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { Resolucion } from '@interfaces/general/resolucion.interface';
import { Concepto } from '@modulos/contenedor/interfaces/concepto.interface';
import { DocumentoTipo } from '@modulos/empresa/interfaces/documento-tipo.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { CuentasComponent } from '../../../../../../comun/componentes/cuentas/cuentas.component';
import { SeleccionarTipoCostoComponent } from '../../../../../../comun/componentes/selectores/seleccionar-tipo-costo/seleccionar-tipo-costo.component';
import { ConceptoService } from '@modulos/humano/servicios/concepto.service';
import { finalize } from 'rxjs';
import { RegistroAutocompletarHumConceptoCuenta } from '@interfaces/comunes/autocompletar/humano/hum-concepto-cuenta.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';

@Component({
  selector: 'app-conceptos-lista',
  templateUrl: './conceptos-lista.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SeleccionarTipoCostoComponent,
    CuentasComponent,
    ReactiveFormsModule,
  ],
})
export class DocumentoDocumentoTipoComponent
  extends General
  implements OnInit, OnDestroy
{
  private _generalService = inject(GeneralService);
  private _conceptoService = inject(ConceptoService);
  private _formBuilder = inject(FormBuilder);

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

  constructor(private modalService: NgbModal) {
    super();
  }

  ngOnInit() {
    this._initFormulario();
    this._getConceptos();
  }

  ngOnDestroy(): void {}

  private _initFormulario() {
    this.formularioConceptoCuenta = this._formBuilder.group({
      concepto: [null],
      cuenta: [null, [Validators.required]],
      tipo_costo: [null, [Validators.required]],
    });
  }

  private _getConceptos() {
    this._generalService
      .consultarDatosAutoCompletar<Concepto>({
        limite: 1000,
        desplazar: 0,
        ordenamientos: ['id'],
        limite_conteo: 10000,
        modelo: 'HumConcepto',
      })
      .subscribe((respuesta) => {
        this.conceptosLista.set(respuesta.registros);
      });
  }

  private _getCuentaConceptos(filtros: ParametrosFiltros) {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumConceptoCuenta>(
        filtros,
      )
      .subscribe((respuesta) => {
        this.cuentaConceptoLista.set(respuesta.registros);
      });
  }

  private _consultarCuentaConceptoPorConceptoId(conceptoId: number) {
    return this._getCuentaConceptos({
      limite: 1000,
      desplazar: 0,
      ordenamientos: ['id'],
      limite_conteo: 10000,
      modelo: 'HumConceptoCuenta',
      filtros: [
        {
          operador: 'exact',
          propiedad: 'concepto',
          valor1: conceptoId,
        },
      ],
    });
  }

  navegarEditar(documentoTipo: any, content: any) {
    this.documentoTipoSeleccionado = documentoTipo;
    this.resolucionId = documentoTipo.id;
    this.changeDetectorRef.detectChanges();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  cerrarModal(resolucion: Resolucion): void {
    this.changeDetectorRef.detectChanges();
    this.modalService.dismissAll();
    this.changeDetectorRef.detectChanges();
  }

  abrirModal(content: any, concepto: Concepto) {
    this.conceptoSelecionado = concepto;
    this.formularioConceptoCuenta.patchValue({
      concepto: concepto.id,
    });

    this._consultarCuentaConceptoPorConceptoId(concepto.id);

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  agregarConceptoCuenta() {
    const conceptoCuentaExist = this.isConceptoCuentaAgregado(
      this.cuentaConceptoLista(),
      {
        cuenta_id: this.formularioConceptoCuenta.get('cuenta')?.value,
        tipo_costo_id: this.formularioConceptoCuenta.get('tipo_costo')?.value,
      },
    );

    if (!conceptoCuentaExist) {
      this._conceptoService
        .agregarConceptoCuenta(this.formularioConceptoCuenta.value)
        .pipe(
          finalize(() => {
            this.cuentaCobrarCodigo = '';
            this.cuentaCobrarNombre = '';
            this.formularioConceptoCuenta.patchValue({
              tipo_costo: null,
              cuenta: null,
            });
          }),
        )
        .subscribe(() => {
          this._consultarCuentaConceptoPorConceptoId(
            this.conceptoSelecionado.id,
          );
          this.alertaService.mensajaExitoso('Se agrego con exito!');
        });
    } else {
      this.cuentaCobrarCodigo = '';
      this.cuentaCobrarNombre = '';
      this.formularioConceptoCuenta.patchValue({
        tipo_costo: null,
        cuenta: null,
      });
      this.alertaService.mensajeError(
        'No se pudo agregar',
        'Actualmente ya existe este registro!',
      );
    }
  }

  agregarCuentaCobrarSeleccionado(cuenta: any) {
    this.formularioConceptoCuenta.get('cuenta')?.setValue(cuenta.cuenta_id);
    this.cuentaCobrarNombre = cuenta.cuenta_nombre;
    this.cuentaCobrarCodigo = cuenta.cuenta_codigo;
    this.changeDetectorRef.detectChanges();
  }

  onSeleccionarTipoCostoChange(id: number) {
    this.formularioConceptoCuenta.patchValue({
      tipo_costo: id,
    });
  }

  onCambioDeCuenta(cuenta: any, cuentaConceptoId: number) {
    this._conceptoService
      .actualizarConceptoCuenta(cuentaConceptoId, {
        cuenta: cuenta.cuenta_id,
      })
      .subscribe(() => {
        this.alertaService.mensajaExitoso('Se actualizo con exito!');
        this._consultarCuentaConceptoPorConceptoId(this.conceptoSelecionado.id); 
      });
  }

  eliminarCuentaConcepto(id: number) {
    this._conceptoService.eliminarConceptoCuenta(id).subscribe(() => {
      this._consultarCuentaConceptoPorConceptoId(this.conceptoSelecionado.id);
      this.alertaService.mensajaExitoso('Se ha eliminado con exito!');
    });
  }

  isConceptoCuentaAgregado(
    lista: RegistroAutocompletarHumConceptoCuenta[],
    nuevoItem: Pick<
      RegistroAutocompletarHumConceptoCuenta,
      'tipo_costo_id' | 'cuenta_id'
    >,
  ): boolean {
    // Verificar si ya existe un ítem con el mismo tipo_costo_id y cuenta_id
    return lista.some(
      (item) =>
        item.tipo_costo_id === nuevoItem.tipo_costo_id
    );
  }
}
