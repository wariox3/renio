import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { ImportarDetallesComponent } from '@comun/componentes/importar-detalles/importar-detalles.component';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarConGrupo } from '@interfaces/comunes/autocompletar/contabilidad/con-grupo.interface';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { Contacto } from '@interfaces/general/contacto';
import { CONTACTO_LISTA_BUSCAR_AVANZADO } from '@modulos/general/domain/mapeos/contacto.mapeo';
import ContactDetalleComponent from '@modulos/general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, finalize, tap, throttleTime, zip } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { CierreService } from './services/cierre.service';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import { DetalleCierreEncabezado } from '@modulos/contabilidad/interfaces/cierre.interface';

@Component({
  selector: 'app-cierre-formulario',
  standalone: true,
  templateUrl: './cierre-formulario.component.html',
  styleUrls: ['./cierre-formulario.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    CardComponent,
    NgbNavModule,
    BuscarAvanzadoComponent,
    CuentasComponent,
    ContactDetalleComponent,
    ImportarDetallesComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
  ],
})
export default class CierreFormularioComponent
  extends General
  implements OnInit
{
  private readonly _modalService = inject(NgbModal);
  private readonly _cierreService = inject(CierreService);
  private readonly _generalService = inject(GeneralService);

  formularioCierre: FormGroup;
  formularioResultado: FormGroup;
  active: Number;
  arrContactos: any[] = [];
  arrDocumentos: any[] = [];
  arrDocumentosSeleccionados: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrRegistrosEliminar: number[] = [];
  documentoDetalleSeleccionarTodos = false;
  agregarDocumentoSeleccionarTodos = false;
  estado_aprobado: boolean = false;
  documentoEnlazado: true;
  total: number = 0;
  totalCredito: number = 0;
  totalDebito: number = 0;
  totalSeleccionado: number = 0;
  theme_value = localStorage.getItem('kt_theme_mode_value');
  arrGrupo: RegistroAutocompletarConGrupo[] = [];
  cuentaDesdeCodigo = '';
  cuentaDesdeNombre = '';
  cuentaHastaCodigo = '';
  cuentaHastaNombre = '';
  cuentaUtilidadCodigo = '';
  cuentaUtilidadNombre = '';
  cargandoResultados = signal<boolean>(false);
  registrosSeleccionados = this._cierreService.registrosSeleccionados;
  cargandoTabla = signal<boolean>(false);
  guardando = signal<boolean>(false);
  public campoListaContacto = CONTACTO_LISTA_BUSCAR_AVANZADO;
  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private facturaService: FacturaService,
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.active = 1;
    this.initForm();
    this.initFormularioResultados();
    if (this.detalle) {
      this.consultardetalle();
    }
    this.changeDetectorRef.detectChanges();
  }

  initFormularioResultados() {
    this.formularioResultado = this.formBuilder.group({
      id: this.detalle,
      cuenta_desde_codigo: [null, Validators.required],
      cuenta_hasta_codigo: [null, Validators.required],
      cuenta_cierre_id: [null, Validators.required],
    });
  }

  initForm() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;

    this.formularioCierre = this.formBuilder.group({
      empresa: [1],
      contacto: ['', Validators.compose([Validators.required])],
      contactoNombre: [''],
      fecha: [
        fechaVencimientoInicial,
        Validators.compose([Validators.required, this.validarFecha31Diciembre()]),
      ],
      comentario: [null],
      total: [0],
      grupo_contabilidad: ['', Validators.compose([Validators.required])],
      grupo_nombre: [''],
      detalles: this.formBuilder.array([]),
    });
  }

  /**
   * Valida si la fecha es 31 de diciembre
   * @param control FormControl a validar
   * @returns objeto de error si la fecha no es 31 de diciembre, null si es válida
   */
  validarFecha31Diciembre(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaString = control.value;
      const fecha = new Date(fechaString);
      const mes = fecha.getMonth(); // 0-11, donde 11 es diciembre
      const dia = fecha.getDate() + 1;

      // Verificamos si la fecha es 31 de diciembre
      if (mes === 11 && dia === 31) {
        return null; // La fecha es válida (31 de diciembre)
      }

      // Si no es 31 de diciembre, devolvemos un error
      return { noEs31Diciembre: true };
    };
  }

  consultardetalle() {
    this.cargandoTabla.set(true);
    this._generalService
      .consultaApi<DetalleCierreEncabezado>(
        `general/documento/${this.detalle}/`,
        {
          serializador: 'detalle_cierre',
        },
      )
      .pipe(finalize(() => this.cargandoTabla.set(false)))
      .subscribe((respuesta) => {
        this.estado_aprobado = respuesta.estado_aprobado;
        this.formularioCierre.patchValue({
          contacto: respuesta.contacto_id,
          contactoNombre: respuesta.contacto__nombre_corto,
          fecha: respuesta.fecha,
          comentario: respuesta.comentario,
          grupo_contabilidad_nombre: respuesta.grupo_contabilidad__nombre,
          grupo_contabilidad: respuesta.grupo_contabilidad,
        });

        this.changeDetectorRef.detectChanges();
      });
  }

  formSubmit() {
    if (this.formularioCierre.valid) {
      this.guardando.set(true);
      if (this.detalle == 0) {
        this.facturaService
          .guardarFactura({
            ...this.formularioCierre.value,
            ...{
              numero: null,
              documento_tipo: 25,
            },
          })
          .pipe(
            finalize(() => this.guardando.set(false)),
            tap((respuesta) => {
              this.router.navigate(
                [`contabilidad/documento/detalle/${respuesta.documento.id}`],
                {
                  queryParams: {
                    ...this.parametrosUrl,
                  },
                },
              );
            }),
          )
          .subscribe();
      } else {
        this.facturaService
          .actualizarDatosFactura({
            ...this.formularioCierre.value,
            detalles_eliminados: this.arrDetallesEliminado,
            id: this.detalle,
          })
          .pipe(finalize(() => this.guardando.set(false)))
          .subscribe((respuesta) => {
            this.router.navigate(
              [`contabilidad/documento/detalle/${respuesta.documento.id}`],
              {
                queryParams: {
                  ...this.parametrosUrl,
                },
              },
            );
          });
      }
    } else {
      this.formularioCierre.markAllAsTouched();
    }
  }

  get detalles() {
    return this.formularioCierre.get('detalles') as FormArray;
  }

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'contacto-ver-mas' || campo === 'contacto') {
      this.formularioCierre.get('contacto')?.setValue(dato.id);
      this.formularioCierre.get('contactoNombre')?.setValue(dato.nombre_corto);
    }

    this.changeDetectorRef.detectChanges();
  }

  consultarCliente(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto>(
        'general/contacto/seleccionar/',
        {
          nombre_corto__icontains: `${event?.target.value}`,
          limit: 10,
        },
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
          this.arrContactos = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  eliminarDocumento(id: number | null) {
    if (!this.formularioCierre) return;

    // Marcar el formulario como modificado
    this.formularioCierre.markAsDirty();
    this.formularioCierre.markAsTouched();

    const detallesArray = this.formularioCierre.get('detalles') as FormArray;

    // Buscar el índice del documento por ID
    const index = detallesArray.controls.findIndex(
      (control) => control.get('id')?.value === id,
    );

    if (index === -1) {
      console.warn(`No se encontró el documento con ID ${id}`);
      return;
    }

    // Eliminar el documento
    if (id === null) {
      detallesArray.removeAt(index);
    } else {
      this.arrDetallesEliminado.push(id);
      detallesArray.removeAt(index);
    }

    // Actualizar el estado
    // this.calcularTotales();
    // this.agregarDocumentoSeleccionarTodos =
    //   !this.agregarDocumentoSeleccionarTodos;
    this.changeDetectorRef.detectChanges();
  }

  actualizarDetalle(index: number, campo: string, evento: any) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;

    if (evento.target.value === '') {
      detalleFormGroup.get(campo)?.patchValue(0);
    }
    this.calcularTotales();
  }

  calcularTotales() {
    this.totalCredito = 0;
    this.totalDebito = 0;
    this.total = 0;
    const detallesArray = this.formularioCierre.get('detalles') as FormArray;
    detallesArray.controls.forEach((detalleControl) => {
      const pago = detalleControl.get('precio')?.value || 0;
      const naturaleza = detalleControl.get('naturaleza')?.value;
      if (naturaleza === 'C') {
        this.totalCredito += parseInt(pago);
      } else {
        this.totalDebito += parseInt(pago);
      }
      this.changeDetectorRef.detectChanges();
    });
    this.total += this.totalCredito - this.totalDebito;
    this.formularioCierre.patchValue({
      total: this.total,
    });
  }

  agregarRegistrosEliminar(index: number, id: number) {
    // Busca el índice del registro en el array de registros a eliminar
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    detalleFormGroup.get('seleccionado')?.patchValue(true);
    const posicion = this.arrRegistrosEliminar.indexOf(id);
    // Si el registro ya está en el array, lo elimina
    if (posicion !== -1) {
      this.arrRegistrosEliminar.splice(posicion, 1);
    } else {
      // Si el registro no está en el array, lo agrega
      this.arrRegistrosEliminar.push(posicion);
    }
  }

  agregarLinea() {
    if (this.formularioCierre.get('contacto')?.value !== '') {
      // se realiza lo siguiente para sugerir al usuario el contacto seleccionado en las lineas agregadas
      const contacto =
        this.formularioCierre.get('contacto')?.value !== ''
          ? this.formularioCierre.get('contacto')?.value
          : null;

      const contactoNombre =
        this.formularioCierre.get('contactoNombre')?.value !== ''
          ? this.formularioCierre.get('contactoNombre')?.value
          : null;

      const grupo = this.formularioCierre.get('grupo_contabilidad')?.value
        ? this.formularioCierre.get('grupo_contabilidad')?.value
        : null;

      const detalleFormGroup = this.formBuilder.group({
        id: [null],
        tipo_registro: ['C'],
        cuenta: [null, Validators.compose([Validators.required])],
        cuenta_codigo: [null],
        cuenta_nombre: [null],
        naturaleza: [null],
        documento_afectado: [null],
        numero: [null],
        grupo: [grupo],
        contacto: [contacto],
        contacto_nombre_corto: [contactoNombre],
        precio: [0, Validators.compose([Validators.required])],
        detalle: [null],
        seleccionado: [false],
        base: [0],
        cantidad: [0],
      });

      this.detalles.push(detalleFormGroup);
    } else {
      this.alertaService.mensajeError('Error', 'Debe seleccionar un contacto');
    }
  }

  agregarCuentaSeleccionado(cuenta: any, index: number) {
    this.detalles.controls[index].patchValue({
      cuenta: cuenta.cuenta_id,
      cuenta_codigo: cuenta.cuenta_codigo,
      cuenta_nombre: cuenta.cuenta_nombre,
      naturaleza: 'D',
    });

    this.formularioCierre.markAsTouched();
    this.formularioCierre.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  agregarContactoSeleccionado(contacto: any, index: number) {
    this.detalles.controls[index].patchValue({
      contacto: contacto.contacto_id,
      contacto_nombre_corto: contacto.contacto_nombre_corto,
    });

    this.formularioCierre.markAsTouched();
    this.formularioCierre.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  abrirModalContactoNuevo(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  cerrarModal(contacto: Contacto) {
    this.modificarCampoFormulario('contacto', contacto);
    this.modalService.dismissAll();
  }

  consultarInformacion() {
    zip(
      this._generalService.consultaApi<RegistroAutocompletarConGrupo>(
        'contabilidad/grupo/seleccionar/',
        {
          limit: 10,
        },
      ),
    ).subscribe((respuesta: any) => {
      this.arrGrupo = respuesta[0];
      this.changeDetectorRef.detectChanges();
    });
  }
}
