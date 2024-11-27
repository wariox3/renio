import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { documentos } from '@comun/extra/mapeoEntidades/informes';
import { HttpService } from '@comun/services/http.service';
import {
  AutocompletarRegistros,
  RegistroAutocompletarContacto,
} from '@interfaces/comunes/autocompletar';
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
import { ContactosComponent } from '../../../../../comun/componentes/contactos/contactos.component';
import ContactoFormulario from '../../../../general/componentes/contacto/contacto-formulario/contacto-formulario.component';
import { TituloAccionComponent } from "../../../../../comun/componentes/titulo-accion/titulo-accion.component";

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
    TituloAccionComponent
],
})
export default class EgresoFormularioComponent
  extends General
  implements OnInit
{
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
  arrDocumentosSeleccionados: any[] = [];
  arrRegistrosEliminar: number[] = [];

  public mostrarTodasCuentasPorPagar: boolean = false;
  public campoLista: CampoLista[] = [
    {
      propiedad: 'id',
      titulo: 'id',
    },
    {
      propiedad: 'numero_identificacion',
      titulo: 'identificacion',
    },
    {
      propiedad: 'nombre_corto',
      titulo: 'nombre_corto',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private modalService: NgbModal,
    private facturaService: FacturaService
  ) {
    super();
  }

  ngOnInit() {
    this.inicializarFormulario();
    this.consultarInformacion();
    if (this.detalle) {
      this.detalle = this.activatedRoute.snapshot.queryParams['detalle'];
      this.consultardetalle();
    }
    this.changeDetectorRef.detectChanges();
  }

  consultarInformacion() {
    zip(
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
        {
          modelo: 'GenCuentaBanco',
          serializador: 'ListaAutocompletar',
        }
      )
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
      numero: [null],
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
            documento_afectado: [detalle.documento_afectado_id],
            numero: [numero],
            contacto: [detalle.contacto_id],
            contacto_nombre: [detalle.contacto_nombre_corto],
            pago: [detalle.pago],
            seleccionado: [false],
            cuenta: detalle.cuenta,
            cuenta_codigo: detalle.cuenta_codigo,
            cuenta_nombre: detalle.cuenta_nombre,
            naturaleza: detalle.naturaleza,
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
      const pago = detalleControl.get('pago')?.value || 0;
      const naturaleza = detalleControl.get('naturaleza')?.value;
      if (naturaleza === 'C') {
        this.totalCredito += parseFloat(pago);
      } else {
        this.totalDebito += parseFloat(pago);
      }
      this.changeDetectorRef.detectChanges();
    });
    this.total += this.totalDebito - this.totalCredito;
    this.formularioEgreso.patchValue({
      total: this.total,
    });
  }

  enviar() {
    if (this.formularioEgreso.valid) {
      if (this.formularioEgreso.get('total')?.value >= 0) {
        if (this.detalle == undefined) {
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
                this.router.navigate(['documento/detalle'], {
                  queryParams: {
                    ...this.parametrosUrl,
                    detalle: respuesta.documento.id,
                  },
                });
              })
            )
            .subscribe();
        } else {
          this.facturaService
            .actualizarDatosFactura(this.detalle, {
              ...this.formularioEgreso.value,
              ...{ detalles_eliminados: this.arrDetallesEliminado },
            })
            .subscribe((respuesta) => {
              this.router.navigate(['documento/detalle'], {
                queryParams: {
                  ...this.parametrosUrl,
                  detalle: respuesta.documento.id,
                },
              });
            });
        }
      } else {
        this.alertaService.mensajeError(
          'Error',
          'El total no puede ser negativo'
        );
      }
    } else {
      this.formularioEgreso.markAllAsTouched();
    }
  }

  consultarCliente(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'nombre_corto__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenContacto',
      serializador: 'ListaAutocompletar',
    };
    this.httpService
      .post<AutocompletarRegistros<RegistroAutocompletarContacto>>(
        'general/funcionalidad/lista/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrContactos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  toggleMostrarTodasCuentasPorPagar() {
    this.mostrarTodasCuentasPorPagar = !this.mostrarTodasCuentasPorPagar;
    this.consultarDocumentos(null);
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
      this.consultarDocumentos(null);
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['cuentas_cobrar'] })
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

  consultarDocumentos(arrFiltrosExtra: any) {
    let filtros = [];
    if (this.mostrarTodasCuentasPorPagar) {
      filtros = [
        { propiedad: 'documento_tipo__pagar', valor1: true },
        { propiedad: 'pendiente__gt', valor1: 0 },
      ];
    } else
      filtros = [
        {
          propiedad: 'contacto_id',
          valor1: this.formularioEgreso.get('contacto')?.value,
          tipo: 'CharField',
        },
        { propiedad: 'documento_tipo__pagar', valor1: true },
        { propiedad: 'pendiente__gt', valor1: 0 },
      ];

    if (arrFiltrosExtra !== null) {
      if (arrFiltrosExtra.length >= 1) {
        filtros = [
          {
            propiedad: 'contacto_id',
            valor1: this.formularioEgreso.get('contacto')?.value,
            tipo: 'CharField',
          },
          { propiedad: 'documento_tipo__pagar', valor1: true },
          { propiedad: 'pendiente__gt', valor1: 0 },
          ...arrFiltrosExtra,
        ];
      } else {
        filtros = [
          {
            propiedad: 'contacto_id',
            valor1: this.formularioEgreso.get('contacto')?.value,
            tipo: 'CharField',
          },
          { propiedad: 'documento_tipo__pagar', valor1: true },
          { propiedad: 'pendiente__gt', valor1: 0 },
        ];
      }
    }
    this.httpService
      .post('general/funcionalidad/lista/', {
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
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  agregarLinea() {
    const detalleFormGroup = this.formBuilder.group({
      id: [null],
      cuenta: [null, Validators.compose([Validators.required])],
      cuenta_codigo: [null],
      cuenta_nombre:  [null],
      naturaleza: [null],
      documento_afectado: [null],
      numero: [null],
      contacto: [null],
      contacto_nombre: [null],
      pago: [null, Validators.compose([Validators.required])],
      seleccionado: [false],
    });
    this.detalles.push(detalleFormGroup);
  }

  agregarCuentaSeleccionado(cuenta: any, index: number) {
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
    this.agregarDocumentoSeleccionarTodos =
      !this.agregarDocumentoSeleccionarTodos;
    this.changeDetectorRef.detectChanges();
  }

  detalleToggleSelectAll() {
    this.formularioEgreso?.markAsDirty();
    this.formularioEgreso?.markAsTouched();
    const detallesArray = this.formularioEgreso.get('detalles') as FormArray;
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

  agregarDocumentosToggleSelectAll() {
    this.mostrarTodasCuentasPorPagar = false;
    this.arrDocumentos.forEach((item: any) => {
      item.selected = !item.selected;
      const index = this.arrDocumentosSeleccionados.find(
        (documento) => documento.id === item.id
      );
      if (index) {
        this.arrDocumentosSeleccionados.splice(index, 1);
      } else {
        this.arrDocumentosSeleccionados.push(item);
      }
    });
    this.agregarDocumentoSeleccionarTodos =
      !this.agregarDocumentoSeleccionarTodos;
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

  obtenerFiltrosModal(arrfiltros: any[]) {
    this.consultarDocumentos(arrfiltros);
  }

  agregarDocumentosPago() {
    this.arrDocumentosSeleccionados.map((documento) => {
      const detalleFormGroup = this.formBuilder.group({
        id: [null],
        documento_afectado: [documento.id],
        numero: [documento.numero],
        contacto: [documento.contacto],
        contacto_nombre: [documento.contacto_nombre],
        pago: [documento.pendiente],
        seleccionado: [false],
        cuenta: [documento.cuenta],
        cuenta_codigo: [documento.cuenta_codigo],
        naturaleza: [documento.naturaleza],
      });
      this.detalles.push(detalleFormGroup);
    });
    this.modalService.dismissAll();
    this.calcularTotales();
  }

  agregarDocumentoSeleccionado(documento: any) {
    const index = this.arrDocumentosSeleccionados.indexOf(documento);
    if (index !== -1) {
      this.arrDocumentosSeleccionados.splice(index, 1);
    } else {
      this.arrDocumentosSeleccionados.push(documento);
    }
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
}
