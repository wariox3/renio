import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { OperacionesService } from '@comun/componentes/factura/services/operaciones.service';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { RegistroAutocompletarGenCuentaBanco } from '@interfaces/comunes/autocompletar/general/gen-cuenta-banco.interface';
import { RegistroAutocompletarGenDocumento } from '@interfaces/comunes/autocompletar/general/gen-documento.interface';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import { Contacto } from '@interfaces/general/contacto';
import { Rutas } from '@interfaces/menu/configuracion.interface';
import { CUENTAS_COBRAR_FILTERS } from '@modulos/cartera/domain/mapeos/cuentas-cobrar.mapeo';
import { CuentaBancoService } from '@modulos/general/servicios/cuenta-banco.service';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { asyncScheduler, Subject, takeUntil, tap, throttleTime } from 'rxjs';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';
import { ContactosComponent } from '../../../../../../comun/componentes/contactos/contactos.component';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { FiltroComponent } from '../../../../../../comun/componentes/ui/tabla/filtro/filtro.component';
import ContactoFormulario from '../../../../../general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';

@Component({
  selector: 'app-pago-formulario',
  standalone: true,
  templateUrl: './pago-formulario.component.html',
  styleUrls: ['./pago-formulario.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    CardComponent,
    NgbNavModule,
    BuscarAvanzadoComponent,
    SoloNumerosDirective,
    CuentasComponent,
    ContactoFormulario,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    ContactosComponent,
    SeleccionarGrupoComponent,
    FiltroComponent,
  ],
})
export default class PagoFormularioComponent
  extends General
  implements OnInit, OnDestroy
{
  private _operacionesService = inject(OperacionesService);
  private _configModuleService = inject(ConfigModuleService);
  private _cuentaBancoSerive = inject(CuentaBancoService);
  private _filterTransformerService = inject(FilterTransformerService);


  CUENTAS_COBRAR_FILTERS = CUENTAS_COBRAR_FILTERS;
  formularioFactura: FormGroup;
  active: Number;
  arrContactos: any[] = [];
  arrDocumentos: any[] = [];
  arrDocumentosSeleccionados: number[] = [];
  arrDetallesEliminado: number[] = [];
  arrRegistrosEliminar: number[] = [];
  documentoDetalleSeleccionarTodos = false;
  agregarDocumentoSeleccionarTodos = false;
  estado_aprobado: false;
  documentoEnlazado: true;
  total: number = 0;
  totalCredito: number = 0;
  totalDebito: number = 0;
  totalSeleccionado: number = 0;
  theme_value = localStorage.getItem('kt_theme_mode_value');
  arrBancos: RegistroAutocompletarGenCuentaBanco[] = [];
  mostrarTodosLosClientes = signal(false);
  arrFiltrosEmitidosAgregarDocumento: ParametrosApi = {};
  arrFiltrosPermanenteAgregarDocumento: ParametrosApi = {
    documento_tipo__cobrar: 'True',
    pendiente__gt: 0,
  };

  private _destroy$ = new Subject<void>();
  private _rutas: Rutas | undefined;

  public campoLista: CampoLista[] = [
    {
      propiedad: 'id',
      titulo: 'id',
      campoTipo: 'IntegerField',
    },
    {
      propiedad: 'numero_identificacion',
      titulo: 'identificacion',
      campoTipo: 'IntegerField',
    },
    {
      propiedad: 'nombre_corto',
      titulo: 'nombre_corto',
      campoTipo: 'IntegerField',
    },
  ];

  private readonly _generalService = inject(GeneralService);

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private facturaService: FacturaService,
  ) {
    super();
  }

  ngOnInit() {
    this.active = 1;
    this._configurarModuleListener();
    this.consultarInformacion();
    this.inicializarFormulario();
    if (this.detalle) {
      this.consultardetalle();
    }
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  private _configurarModuleListener() {
    this._configModuleService.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((modeloConfig) => {
        this._rutas = modeloConfig?.ajustes.rutas;
      });
  }

  inicializarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;

    this.formularioFactura = this.formBuilder.group({
      empresa: [1],
      contacto: ['', Validators.compose([Validators.required])],
      contactoNombre: [''],
      fecha: [
        fechaVencimientoInicial,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      cuenta_banco: ['', Validators.compose([Validators.required])],
      comentario: [null],
      total: [0],
      detalles: this.formBuilder.array([]),
    });
  }

  consultarInformacion() {
    this._cuentaBancoSerive
      .consultarCuentaBanco({
        ordering: 'id',
      })
      .subscribe((respuesta) => {
        this.arrBancos = respuesta.results;
        this.changeDetectorRef.detectChanges();
      });
  }

  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.estado_aprobado = respuesta.documento.estado_aprobado;
        this.formularioFactura.patchValue({
          contacto: respuesta.documento.contacto_id,
          contactoNombre: respuesta.documento.contacto_nombre_corto,
          fecha: respuesta.documento.fecha,
          comentario: respuesta.documento.comentario,
          total: respuesta.documento.total,
          cuenta_banco: respuesta.documento.cuenta_banco_id,
          cuenta_banco_nombre: respuesta.documento.cuenta_banco_nombre,
        });

        respuesta.documento.detalles.forEach((detalle: any) => {
          const numero = detalle.documento_afectado_numero
            ? detalle.documento_afectado_numero
            : detalle.numero
              ? detalle.numero
              : null;
          const detalleFormGroup = this.formBuilder.group({
            id: [detalle.id],
            tipo_registro: detalle.tipo_registro,
            documento_afectado_documento_tipo_nombre: [
              detalle.documento_afectado_documento_tipo_nombre,
            ],
            documento_afectado: [detalle.documento_afectado_id],
            numero: [numero],
            contacto: [
              detalle.documento_afectado_contacto_id
                ? detalle.documento_afectado_contacto_id
                : detalle.contacto_id,
            ],
            contacto_nombre: [
              detalle.documento_afectado_id
                ? detalle.documento_afectado_contacto_nombre_corto
                : detalle.contacto_nombre_corto,
            ],
            precio: [detalle.precio],
            cantidad: [detalle.cantidad],
            seleccionado: [false],
            cuenta: detalle.cuenta,
            cuenta_codigo: detalle.cuenta_codigo,
            cuenta_nombre: detalle.cuenta_nombre,
            naturaleza: detalle.naturaleza,
            base: [detalle.base],
            grupo: [detalle.grupo_id],
          });
          this.detalles.push(detalleFormGroup);
        });
        if (respuesta.documento.estado_aprobado) {
          this.formularioFactura.disable();
        } else {
          this.formularioFactura.markAsPristine();
          this.formularioFactura.markAsUntouched();
        }
        this.calcularTotales();
        this.changeDetectorRef.detectChanges();
      });
  }

  formSubmit() {
    if (this.formularioFactura.valid) {
      if (this.formularioFactura.get('total')?.value >= 0) {
        if (this.detalle == 0) {
          this.facturaService
            .guardarFactura({
              ...this.formularioFactura.value,
              ...{
                numero: null,
                documento_tipo: 4,
              },
            })
            .pipe(
              tap((respuesta) => {
                this.router.navigate(
                  [`${this._rutas?.detalle}/${respuesta.documento.id}`],
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
              ...this.formularioFactura.value,
              detalles_eliminados: this.arrDetallesEliminado,
              id: this.detalle,
            })
            .subscribe((respuesta) => {
              this.router.navigate(
                [`${this._rutas?.detalle}/${respuesta.documento.id}`],
                {
                  queryParams: {
                    ...this.parametrosUrl,
                  },
                },
              );
            });
        }
      } else {
        this.alertaService.mensajeError(
          'Error',
          'El total no puede ser negativo',
        );
      }
    } else {
      this.formularioFactura.markAllAsTouched();
    }
  }

  get detalles() {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'contacto') {
      this.formularioFactura.patchValue({
        contacto: dato.id,
        contactoNombre: dato.nombre_corto,
      });
      this._actualizarDetallesContactoSinDocumentoAfectado();
    }
    if (campo === 'contacto-vermas') {
      this.formularioFactura.patchValue({
        contacto: dato.id,
        contactoNombre: dato.nombre_corto,
      });
    }
    this.changeDetectorRef.detectChanges();
  }

  agregarDocumento(content: any) {
    if (this.formularioFactura.get('contacto')?.value !== '') {
      this.consultarDocumentos();
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['cuentas_cobrar'] }),
      );
      this.totalSeleccionado = 0;
      this.arrDocumentosSeleccionados = [];
      this.agregarDocumentoSeleccionarTodos = false;
      this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'xl',
      });
      this.changeDetectorRef.detectChanges();
    } else {
      this.alertaService.mensajeError('Error', 'Debe seleccionar un contacto');
    }
  }

  consultarCliente(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto>(
        'general/contacto/seleccionar/',
        { nombre_corto__icontains: `${event?.target.value}` },
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

  consultarDocumentos() {
    let filtros: ParametrosApi = {
      limit: 50,
      ordering: 'numero',
      serializador: 'adicionar',
    };
    if (this.mostrarTodosLosClientes()) {
      if (Object.keys(this.arrFiltrosEmitidosAgregarDocumento).length >= 1) {
        filtros = {
          ...filtros,
          ...this.arrFiltrosPermanenteAgregarDocumento,
          ...this.arrFiltrosEmitidosAgregarDocumento,
        };
      }
    } else {
      filtros = {
        ...filtros,
        contacto_id: this.formularioFactura.get('contacto')?.value,
        ...this.arrFiltrosPermanenteAgregarDocumento,
      };

      if (Object.keys(this.arrFiltrosEmitidosAgregarDocumento).length >= 1) {
        filtros = { ...this.arrFiltrosEmitidosAgregarDocumento };
      }
    }

    this._generalService
      .consultaApi<RegistroAutocompletarGenDocumento>(
        'general/documento/',
        filtros,
      )
      .subscribe((respuesta: any) => {
        this.arrDocumentos = respuesta.results.map((documento: any) => ({
          id: documento.id,
          numero: documento.numero,
          fecha: documento.fecha,
          fecha_vence: documento.fecha_vence,
          contacto: documento.contacto_id,
          contacto__nombre_corto: documento.contacto__nombre_corto,
          subtotal: documento.subtotal,
          impuesto: documento.impuesto,
          total: documento.total,
          pendiente: documento.pendiente,
          cuenta: documento.documento_tipo__cuenta_cobrar_id,
          cuenta_codigo: documento.documento_tipo__cuenta_cobrar__codigo,
          documento_tipo_operacion: documento.documento_tipo_operacion,
          documento_tipo: documento.documento_tipo,
          documento_tipo__nombre: documento.documento_tipo__nombre,
          afectado: documento.afectado,
          naturaleza: 'C',
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  // Esta función agrega o elimina un registro del array de registros a eliminar según su presencia actual en el array.
  agregarDocumentoSeleccionado(id: number) {
    // Busca el índice del registro en el array de registros a eliminar
    const index = this.arrDocumentosSeleccionados.indexOf(id);
    // Si el registro ya está en el array, lo elimina
    if (index !== -1) {
      this.arrDocumentosSeleccionados.splice(index, 1);
    } else {
      // Si el registro no está en el array, lo agrega
      this.arrDocumentosSeleccionados.push(id);
    }
    this.calcularTotalDocumentosAgregados();
  }

  private _definirNaturaleza(tipoOperacion: number) {
    return tipoOperacion === -1 ? 'D' : 'C';
  }

  agregarDocumentosPago() {
    this.arrDocumentosSeleccionados.map((id) => {
      let documentoSeleccionado = this.arrDocumentos.find(
        (documento) => documento.id === id,
      );

      const naturaleza = this._definirNaturaleza(
        documentoSeleccionado.documento_tipo_operacion,
      );

      const detalleFormGroup = this.formBuilder.group({
        id: [null],
        tipo_registro: ['C'],
        documento_afectado: [documentoSeleccionado.id],
        documento_tipo__nombre: [
          documentoSeleccionado.documento_tipo__nombre,
        ],
        numero: [documentoSeleccionado.numero],
        contacto: [documentoSeleccionado.contacto],
        contacto__nombre_corto: [documentoSeleccionado.contacto__nombre_corto],
        precio: [documentoSeleccionado.pendiente],
        seleccionado: [false],
        cuenta: [documentoSeleccionado.cuenta],
        cuenta_codigo: [documentoSeleccionado.cuenta_codigo],
        naturaleza: [naturaleza],
        cantidad: [0],
        base: [0],
        grupo: [null],
      });
      this.detalles.push(detalleFormGroup);
    });
    this.modalService.dismissAll();
    this.calcularTotales();
  }

  eliminarDocumento(index: number, id: number | null) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    const detallesArray = this.formularioFactura.get('detalles') as FormArray;
    // Iterar de manera inversa
    const detalleControl = detallesArray.controls[index];
    if (id === null) {
      this.detalles.removeAt(index);
    } else {
      this.arrDetallesEliminado.push(id);
      this.detalles.removeAt(index);
    }

    this.calcularTotales();
    this.agregarDocumentoSeleccionarTodos =
      !this.agregarDocumentoSeleccionarTodos;
    this.changeDetectorRef.detectChanges();
  }

  // Esta función alterna la selección de todos los registros y actualiza el array de registros a eliminar en consecuencia.
  agregarDocumentosToggleSelectAll(event: Event) {
    const seleccionarTodos = event.target as HTMLInputElement;
    this.agregarDocumentoSeleccionarTodos =
      !this.agregarDocumentoSeleccionarTodos;

    if (seleccionarTodos.checked) {
      this.arrDocumentos.forEach((item: any) => {
        item.selected = !item.selected;
        const index = this.arrDocumentosSeleccionados.indexOf(item.id);
        if (index === -1) {
          this.arrDocumentosSeleccionados.push(item.id);
        }
        this.changeDetectorRef.detectChanges();
      });
    } else {
      this.arrDocumentos.forEach((item: any) => {
        item.selected = !item.selected;
      });

      this.arrDocumentosSeleccionados = [];
    }
    this.calcularTotalDocumentosAgregados();
    this.changeDetectorRef.detectChanges();
  }

  estoyEnListaAgregar(id: number): boolean {
    return this.arrDocumentosSeleccionados.indexOf(id) !== -1;
  }

  calcularTotalDocumentosAgregados() {
    this.totalSeleccionado = 0;
    this.arrDocumentosSeleccionados.map((id) => {
      let documentoSeleccionado = this.arrDocumentos.find(
        (documento: any) => documento.id === id,
      );
      this.totalSeleccionado += documentoSeleccionado.pendiente;
    });
    this.changeDetectorRef.detectChanges();
  }

  detalleToggleSelectAll() {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    const detallesArray = this.formularioFactura.get('detalles') as FormArray;
    detallesArray.controls.forEach((detalleControl) => {
      detalleControl
        .get('seleccionado')
        ?.setValue(!detalleControl.get('seleccionado')?.value);
      this.changeDetectorRef.detectChanges();
    });
    this.documentoDetalleSeleccionarTodos =
      !this.documentoDetalleSeleccionarTodos;
    this.changeDetectorRef.detectChanges();
  }

  obtenerFiltrosModal(arrfiltros: any) {
    const apiParams =
      this._filterTransformerService.transformToApiParams(arrfiltros);

    this.arrFiltrosEmitidosAgregarDocumento = apiParams;
    if (arrfiltros.length === 0 && this.mostrarTodosLosClientes() === true) {
      this.mostrarTodosLosClientes.set(false);
    }
    this.consultarDocumentos();
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
    const detallesArray = this.formularioFactura.get('detalles') as FormArray;
    detallesArray.controls.forEach((detalleControl) => {
      const precio = detalleControl.get('precio')?.value || 0;
      const naturaleza = detalleControl.get('naturaleza')?.value;
      if (naturaleza === 'C') {
        this.totalCredito += parseFloat(precio);
      } else {
        this.totalDebito += parseFloat(precio);
      }
      this.changeDetectorRef.detectChanges();
    });
    this.total += this.totalCredito - this.totalDebito;
    this.formularioFactura.patchValue({
      total: this._operacionesService.redondear(this.total, 2),
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
    const detalleFormGroup = this.formBuilder.group({
      id: [null],
      tipo_registro: ['C'],
      cuenta: [null, Validators.compose([Validators.required])],
      cuenta_codigo: [null],
      cuenta_nombre: [null],
      cantidad: [0],
      naturaleza: [null],
      documento_afectado: [null],
      numero: [null],
      contacto: [
        this.formularioFactura.get('contacto')?.value !== ''
          ? this.formularioFactura.get('contacto')?.value
          : null,
      ],
      contacto_nombre: [
        this.formularioFactura.get('contactoNombre')?.value !== ''
          ? this.formularioFactura.get('contactoNombre')?.value
          : null,
      ],
      precio: [null, Validators.compose([Validators.required])],
      seleccionado: [false],
      base: [0],
      grupo: [null],
    });
    this.detalles.push(detalleFormGroup);
  }

  agregarCuentaSeleccionado(cuenta: any, index: number) {
    this.detalles.controls[index].patchValue({
      cuenta: cuenta.id,
      cuenta_codigo: cuenta.codigo,
      cuenta_nombre: cuenta.nombre,
      naturaleza: 'D',
    });

    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  agregarContactoSeleccionado(contacto: any, index: number) {
    this.detalles.controls[index].patchValue({
      contacto: contacto.id,
      contacto_nombre: contacto.nombre_corto,
    });

    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
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

  private _actualizarDetallesContactoSinDocumentoAfectado() {
    const detallesArray = this.formularioFactura.get('detalles') as FormArray;
    if (detallesArray.length > 0) {
      detallesArray.controls.forEach((control: AbstractControl) => {
        if (
          control.get('documento_afectado')?.value === null &&
          control.get('id')?.value === null
        ) {
          control.patchValue({
            contacto:
              this.formularioFactura.get('contacto')?.value !== ''
                ? this.formularioFactura.get('contacto')?.value
                : null,
            contacto_nombre:
              this.formularioFactura.get('contactoNombre')?.value !== ''
                ? this.formularioFactura.get('contactoNombre')?.value
                : null,
          });
          this.formularioFactura.markAsTouched();
          this.formularioFactura.markAsDirty();
          this.changeDetectorRef.detectChanges();
        }
      });
    }
  }

  toggleMostrarTodosLosClientes() {
    this.mostrarTodosLosClientes.update(
      (mostrarTodosLosClientes) =>
        (mostrarTodosLosClientes = !mostrarTodosLosClientes),
    );
    this.consultarDocumentos();
  }

  onSeleccionarGrupoChange(id: number, index: number) {
    this.detalles.controls[index].patchValue({
      grupo: id,
    });
  }
}
