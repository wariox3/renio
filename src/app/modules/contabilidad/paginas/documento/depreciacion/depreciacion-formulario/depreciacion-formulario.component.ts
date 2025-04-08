import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { ImportarDetallesComponent } from '@comun/componentes/importar-detalles/importar-detalles.component';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarConComprobante } from '@interfaces/comunes/autocompletar/contabilidad/con-comprobante.interface';
import { RegistroAutocompletarConGrupo } from '@interfaces/comunes/autocompletar/contabilidad/con-grupo.interface';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { Contacto } from '@interfaces/general/contacto';
import ContactDetalleComponent from '@modulos/general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { DepreciacionService } from '@modulos/contabilidad/servicios/depreciacion.service';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';

@Component({
  selector: 'app-pago-formulario',
  standalone: true,
  templateUrl: './depreciacion-formulario.component.html',
  styleUrls: ['./depreciacion-formulario.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    CardComponent,
    NgbNavModule,
    BuscarAvanzadoComponent,
    ContactDetalleComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    SeleccionarGrupoComponent,
  ],
})
export default class DepreciacionFormularioComponent
  extends General
  implements OnInit
{
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
  arrComprobantes: RegistroAutocompletarConComprobante[] = [];
  arrGrupo: RegistroAutocompletarConGrupo[] = [];

  public campoListaContacto: CampoLista[] = [
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
  private readonly _depreciacionService = inject(DepreciacionService);

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
    if (this.detalle) {
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
      grupo_contabilidad: ['', Validators.compose([Validators.required])],
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
          soporte: respuesta.documento.soporte,
          comprobante: respuesta.documento.comprobante_id,
          comprobante_nombre: respuesta.documento.comprobante_nombre,
          grupo_contabilidad: respuesta.documento.grupo_contabilidad_id,
          grupo_contabilidad_nombre:
            respuesta.documento.grupo_contabilidad_nombre,
        });

        this.detalles.clear();
        respuesta.documento.detalles.forEach((detalle: any) => {
          const detalleFormGroup = this.formBuilder.group({
            id: [detalle.id],
            documento_afectado: [detalle.documento_afectado_id],
            tipo_registro: detalle.tipo_registro,
            numero: [detalle.numero],
            contacto: [
              detalle.documento_afectado_contacto_id
                ? detalle.documento_afectado_contacto_id
                : detalle.contacto_id,
            ],
            contacto_nombre_corto: [
              detalle.documento_afectado_id
                ? detalle.documento_afectado_contacto_nombre_corto
                : detalle.contacto_nombre_corto,
            ],
            precio: [detalle.precio],
            seleccionado: [false],
            cuenta: detalle.cuenta,
            cuenta_codigo: detalle.cuenta_codigo,
            cuenta_nombre: detalle.cuenta_nombre,
            grupo: detalle.grupo_id,
            naturaleza: detalle.naturaleza,
            base_impuesto: detalle.base_impuesto,
            detalle: detalle.detalle,
            cantidad: detalle.cantidad,
            activo: detalle.activo_id,
            activo_codigo: detalle.activo_codigo,
            activo_nombre: detalle.activo_nombre,
            dias: detalle.dias,
          });
          this.detalles.push(detalleFormGroup);
        });
        if (respuesta.documento.estado_aprobado) {
          this.formularioAsiento.disable();
        } else {
          this.formularioAsiento.markAsPristine();
          this.formularioAsiento.markAsUntouched();
        }
        // this.calcularTotales();
        this.changeDetectorRef.detectChanges();
      });
  }

  formSubmit() {
    if (this.formularioAsiento.valid) {
      if (this.detalle == undefined) {
        this.facturaService
          .guardarFactura({
            ...this.formularioAsiento.value,
            ...{
              numero: null,
              documento_tipo: 23,
            },
          })
          .pipe(
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
          .actualizarDatosFactura(this.detalle, {
            ...this.formularioAsiento.value,
            ...{ detalles_eliminados: this.arrDetallesEliminado },
          })
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
      this._actualizarDetallesContactoSinDocumentoAfectado();
    }

    if (campo === 'contacto-ver-mas') {
      this.formularioAsiento.get('contacto')?.setValue(dato.id);
      this.formularioAsiento.get('contactoNombre')?.setValue(dato.nombre_corto);
    }

    this.changeDetectorRef.detectChanges();
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

    // this.calcularTotales();
    this.agregarDocumentoSeleccionarTodos =
      !this.agregarDocumentoSeleccionarTodos;
    this.changeDetectorRef.detectChanges();
  }

  actualizarDetalle(index: number, campo: string, evento: any) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;

    if (evento.target.value === '') {
      detalleFormGroup.get(campo)?.patchValue(0);
    }
    // this.calcularTotales();
  }

  // calcularTotales() {
  //   this.totalCredito = 0;
  //   this.totalDebito = 0;
  //   this.total = 0;
  //   const detallesArray = this.formularioAsiento.get('detalles') as FormArray;
  //   detallesArray.controls.forEach((detalleControl) => {
  //     const pago = detalleControl.get('precio')?.value || 0;
  //     const naturaleza = detalleControl.get('naturaleza')?.value;
  //     if (naturaleza === 'C') {
  //       this.totalCredito += parseInt(pago);
  //     } else {
  //       this.totalDebito += parseInt(pago);
  //     }
  //     this.changeDetectorRef.detectChanges();
  //   });
  //   this.total += this.totalCredito - this.totalDebito;
  //   this.formularioAsiento.patchValue({
  //     total: this.total,
  //   });
  // }

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
    if (this.formularioAsiento.get('contacto')?.value !== '') {
      // se realiza lo siguiente para sugerir al usuario el contacto seleccionado en las lineas agregadas
      const contacto =
        this.formularioAsiento.get('contacto')?.value !== ''
          ? this.formularioAsiento.get('contacto')?.value
          : null;

      const contactoNombre =
        this.formularioAsiento.get('contactoNombre')?.value !== ''
          ? this.formularioAsiento.get('contactoNombre')?.value
          : null;

      const grupo = this.formularioAsiento.get('grupo_contabilidad')?.value
        ? this.formularioAsiento.get('grupo_contabilidad')?.value
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
        base_impuesto: [0],
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

    this.formularioAsiento.markAsTouched();
    this.formularioAsiento.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  agregarContactoSeleccionado(contacto: any, index: number) {
    this.detalles.controls[index].patchValue({
      contacto: contacto.contacto_id,
      contacto_nombre_corto: contacto.contacto_nombre_corto,
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

  consultarInformacion() {
    zip(
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarConComprobante>(
        {
          filtros: [
            {
              propiedad: 'permite_asiento',
              valor1: true,
            },
          ],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'ConComprobante',
          serializador: 'ListaAutocompletar',
        },
      ),
      this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarConGrupo>(
        {
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'ConGrupo',
          serializador: 'ListaAutocompletar',
        },
      ),
    ).subscribe((respuesta: any) => {
      this.arrComprobantes = respuesta[0].registros;
      this.arrGrupo = respuesta[1].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  private _actualizarDetallesContactoSinDocumentoAfectado() {
    const detallesArray = this.formularioAsiento.get('detalles') as FormArray;

    if (detallesArray.length <= 0) {
      return false;
    }

    detallesArray.controls.forEach((control: AbstractControl) => {
      if (control.get('id')?.value === null) {
        const contacto =
          this.formularioAsiento.get('contacto')?.value !== ''
            ? this.formularioAsiento.get('contacto')?.value
            : null;

        const contactoNombre =
          this.formularioAsiento.get('contactoNombre')?.value !== ''
            ? this.formularioAsiento.get('contactoNombre')?.value
            : null;

        control.patchValue({
          contacto: contacto,
          contacto_nombre_corto: contactoNombre,
        });

        this.formularioAsiento.markAsTouched();
        this.formularioAsiento.markAsDirty();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  cargarActivos() {
    this._depreciacionService
      .cargarActivos(this.detalle)
      .subscribe((response) => {
        this.consultardetalle();
      });
  }

  onSeleccionarGrupoChange(id: number) {
    if (!id) {
      this.formularioAsiento.get('grupo_contabilidad')?.setValue('');
    } else {
      this.formularioAsiento.get('grupo_contabilidad')?.setValue(id);
    }
  }
}
