import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import { Contacto } from '@interfaces/general/contacto';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import { ContactosComponent } from '@comun/componentes/contactos/contactos.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import ContactoFormulario from '@modulos/general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarGenCuentaBanco } from '@interfaces/comunes/autocompletar/general/gen-cuenta-banco.interface';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { OperacionesService } from '@comun/componentes/factura/services/operaciones.service';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';

@Component({
  selector: 'app-egreso-formulario',
  standalone: true,
  templateUrl: './egreso-formulario.component.html',
  styleUrls: ['./egreso-formulario.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    CardComponent,
    NgbNavModule,
    BuscarAvanzadoComponent,
    BaseFiltroComponent,
    SoloNumerosDirective,
    CuentasComponent,
    ContactoFormulario,
    NgSelectModule,
    ContactosComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    SeleccionarGrupoComponent,
  ],
})
export default class EgresoFormularioComponent
  extends General
  implements OnInit
{
  private readonly _operacionesService = inject(OperacionesService);

  tapActivo = 1;
  formularioEgreso: FormGroup;
  estado_aprobado: false;
  total: number = 0;
  totalCredito: number = 0;
  totalDebito: number = 0;
  documentoDetalleSeleccionarTodos = false;
  agregarDocumentoSeleccionarTodos = false;
  arrContactos: any[] = [];
  arrContactosDetalle: any[] = [];
  arrDocumentos: any[] = [];
  arrBancos: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrDocumentosSeleccionados: number[] = [];
  arrRegistrosEliminar: number[] = [];
  arrFiltrosEmitidosAgregarDocumento: any[] = [];
  arrFiltrosPermanenteAgregarDocumento: any[] = [
    { propiedad: 'documento_tipo__pagar', valor1: true },
    { propiedad: 'pendiente__gt', valor1: 0 },
  ];

  public mostrarTodasCuentasPorPagar: boolean = false;
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
  private _generalService = inject(GeneralService);

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private facturaService: FacturaService,
  ) {
    super();
  }

  ngOnInit() {
    this.inicializarFormulario();
    this.consultarInformacion();
    if (this.detalle) {
      this.consultardetalle();
    }
    this.changeDetectorRef.detectChanges();
  }

  consultarInformacion() {
    zip(
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenCuentaBanco>(
        {
          modelo: 'GenCuentaBanco',
          serializador: 'ListaAutocompletar',
        },
      ),
    ).subscribe((respuesta: any) => {
      this.arrBancos = respuesta[0]?.registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  inicializarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;

    this.formularioEgreso = this.formBuilder.group({
      empresa: [1],
      contacto: ['', Validators.compose([Validators.required])],
      contactoNombre: [''],
      cuenta_banco_nombre: [''],
      cuenta_banco: ['', Validators.compose([Validators.required])],
      fecha: [
        fechaVencimientoInicial,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      comentario: [null],
      total: [0],
      detalles: this.formBuilder.array([]),
    });
  }

  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        // Asignar valores principales
        this.estado_aprobado = respuesta.documento.estado_aprobado;
        this.formularioEgreso.patchValue({
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
            : null;
          const detalleFormGroup = this.formBuilder.group({
            id: [detalle.id],
            tipo_registro: detalle.tipo_registro,
            documento_afectado_documento_tipo_nombre: [
              detalle.documento_afectado_documento_tipo_nombre,
            ],
            documento_afectado: [detalle.documento_afectado_id],
            numero: [numero],
            contacto: [detalle.contacto_id],
            contacto_nombre: [detalle.contacto_nombre_corto],
            precio: [detalle.precio],
            seleccionado: [false],
            cuenta: detalle.cuenta,
            cuenta_codigo: detalle.cuenta_codigo,
            cuenta_nombre: detalle.cuenta_nombre,
            naturaleza: detalle.naturaleza,
            cantidad: detalle.cantidad,
            grupo: [detalle.grupo_id],
            base: [detalle.base],
          });
          this.detalles.push(detalleFormGroup);
        });
        if (respuesta.documento.estado_aprobado) {
          this.formularioEgreso.disable();
        } else {
          this.formularioEgreso.markAsPristine();
          this.formularioEgreso.markAsUntouched();
        }

        this.calcularTotales();

        this.changeDetectorRef.detectChanges();
      });
  }

  get detalles() {
    return this.formularioEgreso.get('detalles') as FormArray;
  }

  calcularTotales() {
    this.totalCredito = 0;
    this.totalDebito = 0;
    this.total = 0;
    const detallesArray = this.formularioEgreso.get('detalles') as FormArray;
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
    this.total += this.totalDebito - this.totalCredito;
    this.formularioEgreso.patchValue({
      total: this._operacionesService.redondear(this.total, 2),
    });
  }

  enviar() {
    if (this.formularioEgreso.valid) {
      if (this.formularioEgreso.get('total')?.value >= 0) {
        if (this.detalle == 0) {
          this.facturaService
            .guardarFactura({
              ...this.formularioEgreso.value,
              ...{
                numero: null,
                documento_tipo: 8,
              },
            })
            .pipe(
              tap((respuesta) => {
                this.router.navigate(
                  [`tesoreria/documento/detalle/${respuesta.documento.id}`],
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
            .actualizarDatosFactura(this.detalle, {
              ...this.formularioEgreso.value,
              ...{ detalles_eliminados: this.arrDetallesEliminado },
            })
            .subscribe((respuesta) => {
              this.router.navigate(
                [`tesoreria/documento/detalle/${respuesta.documento.id}`],
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
      this.formularioEgreso.markAllAsTouched();
    }
  }

  consultarCliente(event: any) {
    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'nombre_corto__icontains',
          valor1: `${event?.target.value}`,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenContacto',
      serializador: 'ListaAutocompletar',
    };
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarGenContacto>(arrFiltros)
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrContactos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  toggleMostrarTodasCuentasPorPagar() {
    this.mostrarTodasCuentasPorPagar = !this.mostrarTodasCuentasPorPagar;
    this.consultarDocumentos();
    this.changeDetectorRef.detectChanges();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'contacto') {
      this.formularioEgreso.get(campo)?.setValue(dato.contacto_id);
      this.formularioEgreso
        .get('contactoNombre')
        ?.setValue(dato.contacto_nombre_corto);
    }
    this.changeDetectorRef.detectChanges();
  }

  agregarDocumento(content: any) {
    if (this.formularioEgreso.get('contacto')?.value !== '') {
      this.consultarDocumentos();
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['cuentas_cobrar'] }),
      );
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

  consultarDocumentos() {
    let filtros: any[] = [];
    if (this.mostrarTodasCuentasPorPagar) {
      filtros = this.arrFiltrosPermanenteAgregarDocumento;
      if (this.arrFiltrosEmitidosAgregarDocumento.length >= 1) {
        filtros = [
          ...this.arrFiltrosPermanenteAgregarDocumento,
          ...this.arrFiltrosEmitidosAgregarDocumento,
        ];
        this.changeDetectorRef.detectChanges();
      }
    } else {
      filtros = [
        {
          propiedad: 'contacto_id',
          valor1: this.formularioEgreso.get('contacto')?.value,
          tipo: 'CharField',
        },
        ...this.arrFiltrosPermanenteAgregarDocumento,
      ];
      if (this.arrFiltrosEmitidosAgregarDocumento.length >= 1) {
        filtros = [...filtros, ...this.arrFiltrosEmitidosAgregarDocumento];
        this.changeDetectorRef.detectChanges();
      }
      this.changeDetectorRef.detectChanges();
    }
    this._generalService
      .consultarDatosLista({
        filtros,
        limite: 50,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'GenDocumento',
        serializador: 'Adicionar',
      })
      .subscribe((respuesta: any) => {
        this.arrDocumentos = respuesta?.registros?.map((documento: any) => ({
          id: documento.id,
          numero: documento.numero,
          documento_tipo: documento.documento_tipo,
          documento_tipo_nombre: documento.documento_tipo_nombre,
          fecha: documento.fecha,
          fecha_vence: documento.fecha_vence,
          contacto: documento.contacto_id,
          contacto_nombre: documento.contacto_nombre_corto,
          subtotal: documento.subtotal,
          impuesto: documento.impuesto,
          total: documento.total,
          pendiente: documento.pendiente,
          cuenta: documento.documento_tipo_cuenta_pagar_id,
          cuenta_codigo: documento.documento_tipo_cuenta_pagar_cuenta_codigo,
          naturaleza: 'D',
          documento_tipo_operacion: documento.documento_tipo_operacion,
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  agregarLinea() {
    const detalleFormGroup = this.formBuilder.group({
      id: [null],
      tipo_registro: ['C'],
      cuenta: [null, Validators.compose([Validators.required])],
      cuenta_codigo: [null],
      cuenta_nombre: [null],
      naturaleza: [null],
      documento_afectado: [null],
      numero: [null],
      contacto: [
        this.formularioEgreso.get('contacto')?.value !== ''
          ? this.formularioEgreso.get('contacto')?.value
          : null,
      ],
      contacto_nombre: [
        this.formularioEgreso.get('contactoNombre')?.value !== ''
          ? this.formularioEgreso.get('contactoNombre')?.value
          : null,
      ],
      precio: [null, Validators.compose([Validators.required])],
      seleccionado: [false],
      cantidad: [0],
      base: [0],
      grupo: [null],
    });
    this.detalles.push(detalleFormGroup);
  }

  agregarCuentaSeleccionado(cuenta: any, index: number) {
    this.documentoDetalleSeleccionarTodos = false;

    this.detalles.controls[index].patchValue({
      cuenta: cuenta.cuenta_id,
      cuenta_codigo: cuenta.cuenta_codigo,
      cuenta_nombre: cuenta.cuenta_nombre,
      naturaleza: 'C',
    });

    this.formularioEgreso.markAsTouched();
    this.formularioEgreso.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  eliminarDocumento() {
    this.formularioEgreso?.markAsDirty();
    this.formularioEgreso?.markAsTouched();
    const detallesArray = this.formularioEgreso.get('detalles') as FormArray;
    // Iterar de manera inversa
    for (let index = detallesArray.controls.length - 1; index >= 0; index--) {
      const detalleControl = detallesArray.controls[index];
      const seleccionado = detalleControl.get('seleccionado')?.value;
      if (seleccionado) {
        const id = detalleControl.get('id')?.value;
        if (id === null) {
          this.detalles.removeAt(index);
        } else {
          this.arrDetallesEliminado.push(id);
          this.detalles.removeAt(index);
        }
      }
    }

    this.calcularTotales();
    this.documentoDetalleSeleccionarTodos = false;
    this.changeDetectorRef.detectChanges();
  }

  toggleSelectAll(event: Event) {
    const seleccionarTodos = event.target as HTMLInputElement;
    const detallesArray = this.formularioEgreso.get('detalles') as FormArray;
    this.documentoDetalleSeleccionarTodos =
      !this.documentoDetalleSeleccionarTodos;
    this.formularioEgreso?.markAsDirty();
    this.formularioEgreso?.markAsTouched();
    if (seleccionarTodos.checked) {
      detallesArray.controls.forEach((detalleControl: any) => {
        detalleControl.get('seleccionado')?.setValue(true);
      });
    } else {
      detallesArray.controls.forEach((detalleControl: any) => {
        detalleControl.get('seleccionado')?.setValue(false);
      });
    }
    this.changeDetectorRef.detectChanges();
  }

  // Esta función alterna la selección de todos los registros y actualiza el array de registros a eliminar en consecuencia.
  agregarDocumentosToggleSelectAll(event: Event) {
    this.mostrarTodasCuentasPorPagar = false;
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
    this.changeDetectorRef.detectChanges();
  }

  actualizarDetalle(index: number, campo: string, evento: any) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;

    if (evento.target.value === '') {
      detalleFormGroup.get(campo)?.patchValue(0);
    }
    this.calcularTotales();
  }

  agregarRegistrosEliminar(index: number, id: number) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    detalleFormGroup
      .get('seleccionado')
      ?.patchValue(!detalleFormGroup.get('seleccionado')?.value);
  }

  obtenerFiltrosModal(arrfiltros: any[]) {
    this.arrFiltrosEmitidosAgregarDocumento = arrfiltros;
    if (arrfiltros.length === 0 && this.mostrarTodasCuentasPorPagar === true) {
      this.mostrarTodasCuentasPorPagar = false;
    }
    this.consultarDocumentos();
  }

  private _definirNaturaleza(tipoOperacion: number) {
    return tipoOperacion === 1 ? 'D' : 'C';
  }

  agregarDocumentosPago() {
    this.documentoDetalleSeleccionarTodos = false;

    this.arrDocumentosSeleccionados.map((id) => {
      let documentoSeleccionado = this.arrDocumentos.find(
        (documento: any) => documento.id === id,
      );

      const naturaleza = this._definirNaturaleza(
        documentoSeleccionado.documento_tipo_operacion,
      );

      const detalleFormGroup = this.formBuilder.group({
        id: [null],
        tipo_registro: ['C'],
        documento_afectado: [documentoSeleccionado.id],
        documento_afectado_documento_tipo_nombre: [
          documentoSeleccionado.documento_tipo_nombre,
        ],
        numero: [documentoSeleccionado.numero],
        contacto: [documentoSeleccionado.contacto],
        contacto_nombre: [documentoSeleccionado.contacto_nombre],
        precio: [documentoSeleccionado.pendiente],
        seleccionado: [false],
        cuenta: [documentoSeleccionado.cuenta],
        cuenta_codigo: [documentoSeleccionado.cuenta_codigo],
        naturaleza,
        cantidad: [0],
        base: [0],
        grupo: [null],
      });
      this.detalles.push(detalleFormGroup);
    });
    this.modalService.dismissAll();
    this.calcularTotales();
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
  }

  estoyEnListaAgregar(id: number): boolean {
    return this.arrDocumentosSeleccionados.indexOf(id) !== -1;
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

  agregarContactoSeleccionado(contacto: any, index: number) {
    this.detalles.controls[index].patchValue({
      contacto: contacto.contacto_id,
      contacto_nombre: contacto.contacto_nombre_corto,
    });
  }

  actualizarFormulario(dato: any, campo: string) {
    if (campo === 'contacto') {
      this.formularioEgreso.get(campo)?.setValue(dato.id);
      this.formularioEgreso.get('contactoNombre')?.setValue(dato.nombre_corto);
    }

    this.formularioEgreso?.markAsDirty();
    this.formularioEgreso?.markAsTouched();
    this.changeDetectorRef.detectChanges();
  }

  onSeleccionarGrupoChange(id: number, index: number) {
    this.detalles.controls[index].patchValue({
      grupo: id,
    });
  }
}
