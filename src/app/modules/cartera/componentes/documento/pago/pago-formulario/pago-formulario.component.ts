import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { TranslationModule } from '@modulos/i18n';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KeysPipe } from '@pipe/keys.pipe';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-pago-formulario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
    BtnAtrasComponent,
    CardComponent,
    NgbNavModule,
    BuscarAvanzadoComponent,
    KeysPipe,
  ],
  templateUrl: './pago-formulario.component.html',
})
export default class PagoFormularioComponent extends General implements OnInit {
  formularioFactura: FormGroup;
  active: Number;
  arrContactos: any[] = [];
  arrDocumentos: any[] = [];
  arrDocumentosSeleccionados: any[] = [];
  selectAll = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit() {
    this.active = 1;
    this.consultarInformacion();
    this.initForm();
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
      comentario: [''],
      detalles: this.formBuilder.array([]),
    });
  }

  consultarInformacion() {}

  formSubmit() {
    // if (this.formularioFactura.valid) {
    //   if (this.detalle == undefined) {
    //     if (this.validarCamposDetalles() === false) {
    //       this.facturaService
    //         .guardarFactura({
    //           ...this.formularioFactura.value,
    //           ...{
    //             numero: null,
    //             documento_tipo: 1,
    //           },
    //         })
    //         .pipe(
    //           tap((respuesta) => {
    //             this.router.navigate(['documento/detalle'], {
    //               queryParams: {
    //                 documento_clase: this.dataUrl.documento_clase,
    //                 detalle: respuesta.documento.id,
    //               },
    //             });
    //           })
    //         )
    //         .subscribe();
    //     }
    //   } else {
    //     if (this.validarCamposDetalles() === false) {
    //       this.facturaService
    //         .actualizarDatosFactura(this.detalle, {
    //           ...this.formularioFactura.value,
    //           ...{ detalles_eliminados: this.arrDetallesEliminado },
    //         })
    //         .subscribe((respuesta) => {
    //           this.detalles.clear();
    //           respuesta.documento.detalles.forEach(
    //             (detalle: any, indexDetalle: number) => {
    //               const detalleFormGroup = this.formBuilder.group({
    //                 item: [detalle.item],
    //                 cantidad: [detalle.cantidad],
    //                 precio: [detalle.precio],
    //                 porcentaje_descuento: [detalle.porcentaje_descuento],
    //                 descuento: [detalle.descuento],
    //                 subtotal: [detalle.subtotal],
    //                 total_bruto: [detalle.total_bruto],
    //                 total: [detalle.total],
    //                 neto: [detalle.total],
    //                 base_impuesto: [detalle.base_impuesto],
    //                 impuesto: [detalle.impuesto],
    //                 item_nombre: [detalle.item_nombre],
    //                 impuestos: this.formBuilder.array([]),
    //                 impuestos_eliminados: this.formBuilder.array([]),
    //                 id: [detalle.id],
    //               });
    //               if (detalle.impuestos.length === 0) {
    //                 const cantidad = detalleFormGroup.get('cantidad')?.value;
    //                 const precio = detalleFormGroup.get('precio')?.value;
    //                 const neto = cantidad * precio;
    //                 detalleFormGroup.get('neto')?.setValue(neto);
    //               }
    //               this.detalles.push(detalleFormGroup);
    //               detalle.impuestos.forEach((impuesto: any, index: number) => {
    //                 this.agregarImpuesto(
    //                   impuesto,
    //                   indexDetalle,
    //                   'actualizacion'
    //                 );
    //               });
    //             }
    //           );
    //           this.router.navigate(['documento/detalle'], {
    //             queryParams: {
    //               documento_clase: this.dataUrl.documento_clase,
    //               detalle: respuesta.documento.id,
    //             },
    //           });
    //           // this.detalle = respuesta.documento.id;
    //           // this.arrDetallesEliminado = [];
    //           // this.calcularTotales();
    //           // this.formularioFactura.markAsPristine();
    //           // this.formularioFactura.markAsUntouched();
    //           // this.changeDetectorRef.detectChanges();
    //         });
    //     }
    //   }
    // } else {
    //   this.formularioFactura.markAllAsTouched();
    //   this.validarCamposDetalles();
    // }
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
    this.changeDetectorRef.detectChanges();
  }

  agregarDocumento(content: any) {
    this.consultarDocumentos();
    this.arrDocumentosSeleccionados = [];
    this.selectAll = false;
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  eliminarDocumento(index: number, id: number | null) {}

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
      modelo: 'Contacto',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
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

  consultarDocumentos() {
    this.httpService
      .post('general/documento/lista/', {
        filtros: [
          {
            propiedad: 'contacto_id',
            valor1: this.formularioFactura.get('contacto')?.value,
            tipo: 'CharField',
          },
        ],

        limite: 50,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        documento_clase_id: '100',
      })
      .subscribe((respuesta: any) => {
        this.arrDocumentos = respuesta.map((item: any) => ({
          ...item,
          ...{
            selected: false,
          },
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  agregarDocumentoSeleccionado(documento: any) {
    const index = this.arrDocumentosSeleccionados.indexOf(documento);
    if (index !== -1) {
      this.arrDocumentosSeleccionados.splice(index, 1);
    } else {
      this.arrDocumentosSeleccionados.push(documento);
    }
  }

  agregarDocumentosPago() {
    if (this.arrDocumentosSeleccionados.length >= 1) {
      console.log(this.arrDocumentosSeleccionados);

      this.arrDocumentosSeleccionados.map((documento) => {
        const detalleFormGroup = this.formBuilder.group({
          id: [documento.id],
        });

        this.detalles.push(detalleFormGroup);
      });
      this.modalService.dismissAll();
    } else {
      console.log(this.arrDocumentosSeleccionados);
    }
  }

  eliminarDocumentoPago(index: number, id: number | null) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    this.detalles.removeAt(index);
  }

  toggleSelectAll() {
    this.arrDocumentos.forEach((item: any) => {
      item.selected = !item.selected;
      const index = this.arrDocumentosSeleccionados.indexOf(item.id);
      if (index !== -1) {
        this.arrDocumentosSeleccionados.splice(index, 1);
      } else {
        this.arrDocumentosSeleccionados.push(item);
      }
    });
    this.selectAll = !this.selectAll;
    this.changeDetectorRef.detectChanges();
  }
}
