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
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { HttpService } from '@comun/services/http.service';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KeysPipe } from '@pipe/keys.pipe';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { asyncScheduler, tap, throttleTime } from 'rxjs';
import { documentos } from '@comun/extra/mapeoEntidades/informes';
import { Contacto } from '@interfaces/general/contacto';
import ContactoFormulario from '../../../../general/componentes/contacto/contacto-formulario/contacto-formulario.component';
import { AutocompletarRegistros, RegistroAutocompletarContacto } from '@interfaces/comunes/autocompletar';

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
    BtnAtrasComponent,
    CardComponent,
    NgbNavModule,
    BuscarAvanzadoComponent,
    KeysPipe,
    BaseFiltroComponent,
    SoloNumerosDirective,
    CuentasComponent,
    ContactoFormulario,
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
  arrDocumentos: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrDocumentosSeleccionados: any[] = [];
  arrRegistrosEliminar: number[] = [];

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
    if (this.detalle) {
      this.detalle = this.activatedRoute.snapshot.queryParams['detalle'];
      this.consultardetalle();
    }
    this.changeDetectorRef.detectChanges();
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
        this.estado_aprobado = respuesta.documento.estado_aprobado;
        this.formularioEgreso.patchValue({
          contacto: respuesta.documento.contacto_id,
          contactoNombre: respuesta.documento.contacto_nombre_corto,
          fecha: respuesta.documento.fecha,
          comentario: respuesta.documento.comentario,
          total: respuesta.documento.total,
        });

        respuesta.documento.detalles.forEach((detalle: any) => {
          const detalleFormGroup = this.formBuilder.group({
            id: [detalle.id],
            documento_afectado: [detalle.documento_afectado_id],
            numero: [detalle.documento_afectado_numero],
            contacto: [detalle.documento_afectado_contacto_nombre_corto],
            pago: [detalle.pago],
            seleccionado: [false],
            cuenta: detalle.cuenta,
            cuenta_codigo: detalle.cuenta_codigo,
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
        this.totalCredito += parseInt(pago);
      } else {
        this.totalDebito += parseInt(pago);
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
      serializador: "ListaAutocompletar"
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
    let filtros = [
      {
        propiedad: 'contacto_id',
        valor1: this.formularioEgreso.get('contacto')?.value,
        tipo: 'CharField',
      },
      { propiedad: 'documento_tipo__documento_clase__grupo', valor1: 3 },
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
          { propiedad: 'documento_tipo__documento_clase__grupo', valor1: 3 },
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
          { propiedad: 'documento_tipo__documento_clase__grupo', valor1: 3 },
          { propiedad: 'pendiente__gt', valor1: 0 },
        ];
      }
    }
    this.httpService
      .post('general/general/lista/', {
        filtros,
        limite: 50,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'GenDocumento',
        serializador: 'Adicionar',
      })
      .subscribe((respuesta: any) => {
        this.arrDocumentos = respuesta.map((documento: any) => ({
          id: documento.id,
          numero: documento.numero,
          fecha: documento.fecha,
          fecha_vence: documento.fecha_vence,
          contacto: documento.contacto_nombre_corto,
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
      naturaleza: [null],
      documento_afectado: [null],
      numero: [null],
      contacto: [null],
      pago: [null, Validators.compose([Validators.required])],
      seleccionado: [false],
    });
    this.detalles.push(detalleFormGroup);
  }

  agregarCuentaSeleccionado(cuenta: any, index: number) {
    this.detalles.controls[index].patchValue({
      cuenta: cuenta.cuenta_id,
      cuenta_codigo: cuenta.cuenta_codigo,
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
}
