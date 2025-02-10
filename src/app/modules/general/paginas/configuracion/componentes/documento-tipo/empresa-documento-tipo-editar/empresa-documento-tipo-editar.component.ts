import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { TranslateModule } from '@ngx-translate/core';
import { zip } from 'rxjs';
import { RegistroAutocompletarGenResolucion } from '@interfaces/comunes/autocompletar/general/gen-resolucion.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';

@Component({
  selector: 'app-empresa-documento-tipo-editar',
  templateUrl: './empresa-documento-tipo-editar.component.html',
  standalone: true,
  imports: [
    BtnAtrasComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    CuentasComponent
],
})
export class EmpresaDocumentoTipoEditarComponent
  extends General
  implements OnInit
{
  formularioDocumentoTipo: FormGroup;
  arrResoluciones: RegistroAutocompletarGenResolucion[] = [];

  @Input() ocultarBtnAtras: Boolean = false;
  @Input() tipoRolucion: 'compra' | 'venta';
  @Input() tituloFijo: Boolean = false;
  @Input() editarInformacion: Boolean = false;
  @Input() idEditarInformacion: number | null = null;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();
  private _generalService = inject(GeneralService);

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    if (this.detalle || this.editarInformacion) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    this.formularioDocumentoTipo = this.formBuilder.group({
      consecutivo: ['', Validators.compose([Validators.required])],
      resolucion: [''],
      cuenta_pagar: [''],
      cuenta_pagar_codigo: [''],
      cuenta_pagar_nombre: [''],
      cuenta_cobrar: [''],
      cuenta_cobrar_codigo: [''],
      cuenta_cobrar_nombre: [''],
    });
  }

  enviarFormulario() {
    if (this.formularioDocumentoTipo.valid) {
      let tipoResolucion: any = {};
      tipoResolucion[this.parametrosUrl?.parametro!] = true;

      if (this.tipoRolucion != null) {
        tipoResolucion[this.tipoRolucion] = true;
      }

      if (this.detalle || this.idEditarInformacion) {
        let resolucionId = this.detalle;

        if (this.idEditarInformacion !== null) {
          resolucionId = this.idEditarInformacion;
        }

        this.empresaService
          .actualizarDocumentoTipo(resolucionId, {
            ...this.formularioDocumentoTipo.value,
            ...{tipoResolucion},
          })
          .subscribe((respuesta: any) => {
            this.formularioDocumentoTipo.patchValue({
              consecutivo: respuesta.consecutivo,
              resolucion: respuesta.resolucion,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            if (this.ocultarBtnAtras) {
              this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
            } else {
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`/administrador/detalle`], {
                  queryParams: {
                    ...parametro,
                    detalle: respuesta.id,
                  },
                });
              });
            }
          });
      }
    } else {
      this.formularioDocumentoTipo.markAllAsTouched();
    }
  }

  consultardetalle() {
    let resolucionId = this.detalle;

    if (this.idEditarInformacion !== null) {
      resolucionId = this.idEditarInformacion;
    }

    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'numero__icontains',
          valor1: ``,
        },
        {
          propiedad: this.tipoRolucion,
          valor1: true,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenResolucion',
      serializador: 'ListaAutocompletar',
    };

    zip(
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenResolucion>(
        arrFiltros
      ),
      this.empresaService.consultarDocumentoTipoDetalle(resolucionId)
    ).subscribe((respuesta: any) => {
      this.arrResoluciones = respuesta[0].registros;
      this.formularioDocumentoTipo.patchValue({
        consecutivo: respuesta[1].consecutivo,
        resolucion: respuesta[1].resolucion_id,
        cuenta_pagar: respuesta[1].cuenta_pagar_id,
        cuenta_pagar_codigo: respuesta[1].cuenta_pagar_codigo,
        cuenta_pagar_nombre: respuesta[1].cuenta_pagar_nombre,
        cuenta_cobrar: respuesta[1].cuenta_cobrar_id,
        cuenta_cobrar_codigo: respuesta[1].cuenta_cobrar_codigo,
        cuenta_cobrar_nombre: respuesta[1].cuenta_cobrar_nombre,
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  agregarCuentaPagarSeleccionado(cuenta: any) {
    this.formularioDocumentoTipo.patchValue({
      cuenta_pagar: cuenta.cuenta_id,
      cuenta_pagar_codigo: cuenta.cuenta_codigo,
      cuenta_pagar_nombre: cuenta.cuenta_nombre,
    });
  }

  agregarCuentaCobrarSeleccionado(cuenta: any) {
    this.formularioDocumentoTipo.patchValue({
      cuenta_cobrar: cuenta.cuenta_id,
      cuenta_cobrar_codigo: cuenta.cuenta_codigo,
      cuenta_cobrar_nombre: cuenta.cuenta_nombre,
    });
  }

  actualizarCuentaCobrarNull(){
    this.formularioDocumentoTipo.patchValue({
      cuenta_cobrar: null,
      cuenta_cobrar_codigo: null,
      cuenta_cobrar_nombre: null,
    });
  }

  actualizarCuentaPagarNull(){
    this.formularioDocumentoTipo.patchValue({
      cuenta_pagar: null,
      cuenta_pagar_codigo: null,
      cuenta_pagar_nombre: null,
    });
  }
}
