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
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';

import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KeysPipe } from '@pipe/keys.pipe';
import { asyncScheduler, tap, throttleTime } from 'rxjs';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { documentos } from '@comun/extra/mapeoEntidades/informes';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';
import { Contacto } from '@interfaces/general/contacto';
import ContactDetalleComponent from "../../../../general/componentes/contacto/contacto-formulario/contacto-formulario.component";

@Component({
  selector: 'app-pago-formulario',
  standalone: true,
  templateUrl: './asiento-formulario.component.html',
  styleUrls: ['./asiento-formulario.component.scss'],
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
    ContactDetalleComponent
],
})
export default class AsientoFormularioComponent extends General implements OnInit {
  formularioAsiento: FormGroup;
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

    this.formularioAsiento = this.formBuilder.group({
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
        this.formularioAsiento.patchValue({
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
          this.formularioAsiento.disable();
        } else {
          this.formularioAsiento.markAsPristine();
          this.formularioAsiento.markAsUntouched();
        }
        this.calcularTotales();
        this.changeDetectorRef.detectChanges();
      });
  }

  formSubmit() {
    if (this.formularioAsiento.valid) {
      if (this.formularioAsiento.get('total')?.value >= 0) {
        if (this.detalle == undefined) {
          this.facturaService
            .guardarFactura({
              ...this.formularioAsiento.value,
              ...{
                numero: null,
                documento_tipo: 13,
              },
            })
            .pipe(
              tap((respuesta) => {
                this.router.navigate(['documento/detalle'], {
                  queryParams: {
                    documento_clase: this.parametrosUrl.documento_clase,
                    detalle: respuesta.documento.id,
                  },
                });
              })
            )
            .subscribe();
        } else {
          this.facturaService
            .actualizarDatosFactura(this.detalle, {
              ...this.formularioAsiento.value,
              ...{ detalles_eliminados: this.arrDetallesEliminado },
            })
            .subscribe((respuesta) => {
              this.router.navigate(['documento/detalle'], {
                queryParams: {
                  documento_clase: this.parametrosUrl.documento_clase,
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
      this.formularioAsiento.markAllAsTouched();
    }
  }

  get detalles() {
    return this.formularioAsiento.get('detalles') as FormArray;
  }

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'contacto') {
      this.formularioAsiento.get(campo)?.setValue(dato.contacto_id);
      this.formularioAsiento
        .get('contactoNombre')
        ?.setValue(dato.contacto_nombre_corto);
    }
    this.changeDetectorRef.detectChanges();
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
    };
    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
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
    this.formularioAsiento?.markAsDirty();
    this.formularioAsiento?.markAsTouched();
    const detallesArray = this.formularioAsiento.get('detalles') as FormArray;
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
    this.formularioAsiento?.markAsDirty();
    this.formularioAsiento?.markAsTouched();
    const detallesArray = this.formularioAsiento.get('detalles') as FormArray;
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
    const detallesArray = this.formularioAsiento.get('detalles') as FormArray;
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
    this.total += this.totalCredito - this.totalDebito;
    this.formularioAsiento.patchValue({
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
      naturaleza: 'D',
    });

    this.formularioAsiento.markAsTouched();
    this.formularioAsiento.markAsDirty();
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
