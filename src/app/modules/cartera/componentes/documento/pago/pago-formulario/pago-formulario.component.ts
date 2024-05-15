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
import { documentos } from '@comun/extra/mapeoEntidades/documentos';

@Component({
  selector: 'app-pago-formulario',
  standalone: true,
  templateUrl: './pago-formulario.component.html',
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
    BaseFiltroComponent,
  ],
})
export default class PagoFormularioComponent extends General implements OnInit {
  formularioFactura: FormGroup;
  active: Number;
  arrContactos: any[] = [];
  arrDocumentos: any[] = [];
  arrDocumentosSeleccionados: any[] = [];
  arrDetallesEliminado: number[] = [];
  selectAll = false;

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
      comentario: [null],
      detalles: this.formBuilder.array([]),
    });
  }

  consultarInformacion() {}

  formSubmit() {
    if (this.formularioFactura.valid) {
      if (this.detalle == undefined) {
        this.facturaService
          .guardarFactura({
            ...this.formularioFactura.value,
            ...{
              numero: null,
              documento_tipo: 1,
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
            ...this.formularioFactura.value,
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
    this.changeDetectorRef.detectChanges();
  }

  agregarDocumento(content: any) {
    if (this.formularioFactura.get('contacto')?.value !== '') {
      this.consultarDocumentos(null);
      this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[100] }));
      this.arrDocumentosSeleccionados = [];
      this.selectAll = false;
      this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
        size: 'lg',
      });
      this.changeDetectorRef.detectChanges();
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se cuenta con un cliente seleccionado'
      );
    }
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

  consultarDocumentos(filtrosExtra: any) {
    let filtros = [
      {
        propiedad: 'contacto_id',
        valor1: this.formularioFactura.get('contacto')?.value,
        tipo: 'CharField',
      },
    ];
    if (filtrosExtra !== null) {
      filtros = [...filtros, ...filtrosExtra];
    }
    this.httpService
      .post('general/documento/lista/', {
        filtros,
        limite: 50,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        documento_clase_id: '100',
      })
      .subscribe((respuesta: any) => {
        this.arrDocumentos = respuesta.map((item: any) => ({
          id: item.id,
          numero: item.numero,
          fecha: item.fecha,
          total: item.total,
          selected: false,
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
    if (id != null) {
      this.arrDetallesEliminado.push(id);
    }
    this.detalles.removeAt(index);
  }

  toggleSelectAll() {
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
    this.selectAll = !this.selectAll;
    this.changeDetectorRef.detectChanges();
  }

  obtenerFiltrosModal(arrfiltros: any[]) {
    // if (arrfiltros.length >= 1) {
    //   this.arrParametrosConsulta.filtros = arrfiltros;
    // } else {
    //   localStorage.removeItem(this.nombreFiltro);
    // }
    // this.changeDetectorRef.detectChanges();
    this.consultarDocumentos(arrfiltros);
  }
}
