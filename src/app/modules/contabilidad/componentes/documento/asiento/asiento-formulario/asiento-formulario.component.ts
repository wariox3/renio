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
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';
import { Contacto } from '@interfaces/general/contacto';
import ContactDetalleComponent from '@modulos/general/componentes/contacto/contacto-formulario/contacto-formulario.component';
import { ContactosComponent } from '@comun/componentes/contactos/contactos.component';
import { ImportarDetallesComponent } from '@comun/componentes/importar-detalles/importar-detalles.component';

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
    ContactDetalleComponent,
    ContactosComponent,
    ImportarDetallesComponent
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
            numero: [detalle.numero],
            contacto: [detalle.documento_afectado_contacto_nombre_corto],
            contacto_nombre_corto: [detalle.contacto_nombre_corto],
            total: [detalle.total],
            seleccionado: [false],
            cuenta: detalle.cuenta,
            cuenta_codigo: detalle.cuenta_codigo,
            naturaleza: detalle.naturaleza,
            base_impuesto: detalle.base_impuesto,
            detalle: detalle.detalle,
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
      const pago = detalleControl.get('total')?.value || 0;
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
      contacto_nombre_corto: [null],
      total: [0, Validators.compose([Validators.required])],
      detalle: [null],
      seleccionado: [false],
      base_impuesto: [0]
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

  agregarContactoSeleccionado(contacto: any, index: number) {
    this.detalles.controls[index].patchValue({
      contacto: contacto.contacto_id,
      contacto_nombre_corto: contacto.contacto_nombre_corto
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
