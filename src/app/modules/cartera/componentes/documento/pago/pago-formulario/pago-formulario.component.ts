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
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';
import { documentos } from '@comun/extra/mapeoEntidades/informes';
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
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { asyncScheduler, tap, throttleTime } from 'rxjs';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import ContactoFormulario from '../../../../../general/componentes/contacto/contacto-formulario/contacto-formulario.component';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { ContactosComponent } from '../../../../../../comun/componentes/contactos/contactos.component';

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
    BaseFiltroComponent,
    SoloNumerosDirective,
    CuentasComponent,
    ContactoFormulario,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    ContactosComponent,
  ],
})
export default class PagoFormularioComponent extends General implements OnInit {
  formularioFactura: FormGroup;
  active: Number;
  arrContactos: any[] = [];
  arrDocumentos: any[] = [];
  arrDocumentosSeleccionados: any[] = [];
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
    this.active = 1;
    this.initForm();
    if (this.detalle) {
      this.detalle = this.activatedRoute.snapshot.queryParams['detalle'];
      this.consultardetalle();
    }
    this.changeDetectorRef.detectChanges();
  }

  initForm() {
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
        this.formularioFactura.patchValue({
          contacto: respuesta.documento.contacto_id,
          contactoNombre: respuesta.documento.contacto_nombre_corto,
          fecha: respuesta.documento.fecha,
          comentario: respuesta.documento.comentario,
          total: respuesta.documento.total,
        });

        respuesta.documento.detalles.forEach((detalle: any) => {
          const numero = detalle.documento_afectado_numero
            ? detalle.documento_afectado_numero
            : detalle.numero
            ? detalle.numero
            : null;
          const detalleFormGroup = this.formBuilder.group({
            id: [detalle.id],
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
        if (this.detalle == undefined) {
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
              ...this.formularioFactura.value,
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
      this.formularioFactura.markAllAsTouched();
    }
  }

  get detalles() {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'contacto') {
      this.formularioFactura.get(campo)?.setValue(dato.contacto_id);
      this.formularioFactura
        .get('contactoNombre')
        ?.setValue(dato.contacto_nombre_corto);
    }
    if (campo === 'contacto-vermas') {
      this.formularioFactura.get('contacto')?.setValue(dato.id);
      this.formularioFactura.get('contactoNombre')?.setValue(dato.nombre_corto);
    }
    this.changeDetectorRef.detectChanges();
  }

  agregarDocumento(content: any) {
    if (this.formularioFactura.get('contacto')?.value !== '') {
      this.consultarDocumentos(null);
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['cuentas_cobrar'] })
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

  consultarDocumentos(arrFiltrosExtra: any) {
    let filtros = [
      {
        propiedad: 'contacto_id',
        valor1: this.formularioFactura.get('contacto')?.value,
        tipo: 'CharField',
      },
      { propiedad: 'documento_tipo__documento_clase__grupo', valor1: 1 },
      { propiedad: 'pendiente__gt', valor1: 0 },
    ];
    if (arrFiltrosExtra !== null) {
      if (arrFiltrosExtra.length >= 1) {
        filtros = [
          {
            propiedad: 'contacto_id',
            valor1: this.formularioFactura.get('contacto')?.value,
            tipo: 'CharField',
          },
          { propiedad: 'documento_tipo__documento_clase__grupo', valor1: 1 },
          { propiedad: 'pendiente__gt', valor1: 0 },
          ...arrFiltrosExtra,
        ];
      } else {
        filtros = [
          {
            propiedad: 'contacto_id',
            valor1: this.formularioFactura.get('contacto')?.value,
            tipo: 'CharField',
          },
          { propiedad: 'documento_tipo__documento_clase__grupo', valor1: 1 },
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
        this.arrDocumentos = respuesta.registros.map((documento: any) => ({
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
          cuenta: documento.documento_tipo_cuenta_cobrar_id,
          cuenta_codigo: documento.documento_tipo_cuenta_cobrar_cuenta_codigo,
          naturaleza: 'C',
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  agregarDocumentoSeleccionado(documento: any) {
    const index = this.arrDocumentosSeleccionados.indexOf(documento);
    if (index !== -1) {
      this.totalSeleccionado -= documento.total;
      this.arrDocumentosSeleccionados.splice(index, 1);
    } else {
      this.totalSeleccionado += documento.total;
      this.arrDocumentosSeleccionados.push(documento);
    }
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

  agregarDocumentosToggleSelectAll() {
    this.arrDocumentos.forEach((item: any) => {
      item.selected = !item.selected;
      const index = this.arrDocumentosSeleccionados.find(
        (documento) => documento.id === item.id
      );
      if (index) {
        this.totalSeleccionado -= item.total;
        this.arrDocumentosSeleccionados.splice(index, 1);
      } else {
        this.totalSeleccionado += item.total;
        this.arrDocumentosSeleccionados.push(item);
      }
    });
    this.agregarDocumentoSeleccionarTodos =
      !this.agregarDocumentoSeleccionarTodos;
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

  obtenerFiltrosModal(arrfiltros: any[]) {
    this.consultarDocumentos(arrfiltros);
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
      const pago = detalleControl.get('pago')?.value || 0;
      const naturaleza = detalleControl.get('naturaleza')?.value;
      if (naturaleza === 'C') {
        this.totalCredito += parseFloat(pago) ;
      } else {
        this.totalDebito += parseFloat(pago);
      }
      this.changeDetectorRef.detectChanges();
    });
    this.total += this.totalCredito - this.totalDebito;
    this.formularioFactura.patchValue({
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
    const detalleFormGroup = this.formBuilder.group({
      id: [null],
      cuenta: [null, Validators.compose([Validators.required])],
      cuenta_codigo: [null],
      cuenta_nombre: [null],
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
      naturaleza: 'D',
    });

    this.formularioFactura.markAsTouched();
    this.formularioFactura.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  agregarContactoSeleccionado(contacto: any, index: number) {
    this.detalles.controls[index].patchValue({
      contacto: contacto.contacto_id,
      contacto_nombre: contacto.contacto_nombre_corto,
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
}
