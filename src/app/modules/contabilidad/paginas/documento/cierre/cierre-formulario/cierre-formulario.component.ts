import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
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
import { ContactosComponent } from '@comun/componentes/contactos/contactos.component';
import { CuentasComponent } from '@comun/componentes/cuentas/cuentas.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { ImportarDetallesComponent } from '@comun/componentes/importar-detalles/importar-detalles.component';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { GeneralService } from '@comun/services/general.service';
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

@Component({
  selector: 'app-cierre-formulario',
  standalone: true,
  templateUrl: './cierre-formulario.component.html',
  styleUrls: ['./cierre-formulario.component.scss'],
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
    ContactDetalleComponent,
    ContactosComponent,
    ImportarDetallesComponent,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
  ],
})
export default class CierreFormularioComponent
  extends General
  implements OnInit
{
  private readonly _modalService = inject(NgbModal);

  formularioCierre: FormGroup;
  formularioResultado: FormGroup;
  active: Number;
  arrContactos: any[] = [];
  arrDocumentos: any[] = [];
  arrDocumentosSeleccionados: any[] = [];
  arrDetallesEliminado: number[] = [];
  arrRegistrosEliminar: number[] = [];
  documentoDetalleSeleccionarTodos = false;
  agregarDocumentoSeleccionarTodos = false;
  estado_aprobado: boolean = false;
  documentoEnlazado: true;
  total: number = 0;
  totalCredito: number = 0;
  totalDebito: number = 0;
  totalSeleccionado: number = 0;
  theme_value = localStorage.getItem('kt_theme_mode_value');
  arrGrupo: RegistroAutocompletarConGrupo[] = [];
  cuentaCodigo = '';
  cuentaNombre = '';
  cuentaDesdeCodigo = '';
  cuentaDesdeNombre = '';
  cuentaHastaCodigo = '';
  cuentaHastaNombre = '';
  cargandoResultados = signal<boolean>(false);

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
    this.initFormularioResultados();
    if (this.detalle) {
      this.detalle = this.activatedRoute.snapshot.queryParams['detalle'];
      this.consultardetalle();
    }
    this.changeDetectorRef.detectChanges();
  }

  initFormularioResultados() {
    this.formularioResultado = this.formBuilder.group({
      cuenta_desde_id: [],
      cuenta_hasta_id: [],
    });
  }

  initForm() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;

    this.formularioCierre = this.formBuilder.group({
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
      grupo_contabilidad: [''],
      cuenta: [null, Validators.required],
      grupo_nombre: [''],
      detalles: this.formBuilder.array([]),
    });
  }

  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.estado_aprobado = respuesta.documento.estado_aprobado;
        this.formularioCierre.patchValue({
          contacto: respuesta.documento.contacto_id,
          contactoNombre: respuesta.documento.contacto_nombre_corto,
          fecha: respuesta.documento.fecha,
          comentario: respuesta.documento.comentario,
          total: respuesta.documento.total,
          cuenta: respuesta.documento.cuenta_id,
          grupo_contabilidad: respuesta.documento.grupo_contabilidad_id,
          grupo_contabilidad_nombre:
            respuesta.documento.grupo_contabilidad_nombre,
        });

        this.cuentaNombre = respuesta.documento.cuenta_nombre;
        this.cuentaCodigo = respuesta.documento.cuenta_codigo;

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
            base: detalle.base,
            detalle: detalle.detalle,
            cantidad: detalle.cantidad,
          });
          this.detalles.push(detalleFormGroup);
        });
        if (respuesta.documento.estado_aprobado) {
          this.formularioCierre.disable();
        } else {
          this.formularioCierre.markAsPristine();
          this.formularioCierre.markAsUntouched();
        }
        this.calcularTotales();
        this.changeDetectorRef.detectChanges();
      });
  }

  formSubmit() {
    if (this.formularioCierre.valid) {
      if (this.formularioCierre.get('total')?.value >= 0) {
        if (this.detalle == undefined) {
          this.facturaService
            .guardarFactura({
              ...this.formularioCierre.value,
              ...{
                numero: null,
                documento_tipo: 25,
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
              }),
            )
            .subscribe();
        } else {
          this.facturaService
            .actualizarDatosFactura(this.detalle, {
              ...this.formularioCierre.value,
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
          'El total no puede ser negativo',
        );
      }
    } else {
      this.formularioCierre.markAllAsTouched();
    }
  }

  get detalles() {
    return this.formularioCierre.get('detalles') as FormArray;
  }

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'contacto') {
      this.formularioCierre.get(campo)?.setValue(dato.contacto_id);
      this.formularioCierre
        .get('contactoNombre')
        ?.setValue(dato.contacto_nombre_corto);
      this._actualizarDetallesContactoSinDocumentoAfectado();
    }

    if (campo === 'contacto-ver-mas') {
      this.formularioCierre.get('contacto')?.setValue(dato.id);
      this.formularioCierre.get('contactoNombre')?.setValue(dato.nombre_corto);
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
    this.formularioCierre?.markAsDirty();
    this.formularioCierre?.markAsTouched();
    const detallesArray = this.formularioCierre.get('detalles') as FormArray;
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
    const detallesArray = this.formularioCierre.get('detalles') as FormArray;
    detallesArray.controls.forEach((detalleControl) => {
      const pago = detalleControl.get('precio')?.value || 0;
      const naturaleza = detalleControl.get('naturaleza')?.value;
      if (naturaleza === 'C') {
        this.totalCredito += parseInt(pago);
      } else {
        this.totalDebito += parseInt(pago);
      }
      this.changeDetectorRef.detectChanges();
    });
    this.total += this.totalCredito - this.totalDebito;
    this.formularioCierre.patchValue({
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
    if (this.formularioCierre.get('contacto')?.value !== '') {
      // se realiza lo siguiente para sugerir al usuario el contacto seleccionado en las lineas agregadas
      const contacto =
        this.formularioCierre.get('contacto')?.value !== ''
          ? this.formularioCierre.get('contacto')?.value
          : null;

      const contactoNombre =
        this.formularioCierre.get('contactoNombre')?.value !== ''
          ? this.formularioCierre.get('contactoNombre')?.value
          : null;

      const grupo = this.formularioCierre.get('grupo_contabilidad')?.value
        ? this.formularioCierre.get('grupo_contabilidad')?.value
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
        base: [0],
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

    this.formularioCierre.markAsTouched();
    this.formularioCierre.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  agregarContactoSeleccionado(contacto: any, index: number) {
    this.detalles.controls[index].patchValue({
      contacto: contacto.contacto_id,
      contacto_nombre_corto: contacto.contacto_nombre_corto,
    });

    this.formularioCierre.markAsTouched();
    this.formularioCierre.markAsDirty();
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
    ).subscribe((respuesta) => {
      this.arrGrupo = respuesta[0].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  private _actualizarDetallesContactoSinDocumentoAfectado() {
    const detallesArray = this.formularioCierre.get('detalles') as FormArray;

    if (detallesArray.length <= 0) {
      return false;
    }

    detallesArray.controls.forEach((control: AbstractControl) => {
      if (control.get('id')?.value === null) {
        const contacto =
          this.formularioCierre.get('contacto')?.value !== ''
            ? this.formularioCierre.get('contacto')?.value
            : null;

        const contactoNombre =
          this.formularioCierre.get('contactoNombre')?.value !== ''
            ? this.formularioCierre.get('contactoNombre')?.value
            : null;

        control.patchValue({
          contacto: contacto,
          contacto_nombre_corto: contactoNombre,
        });

        this.formularioCierre.markAsTouched();
        this.formularioCierre.markAsDirty();
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  agregarCuentaCobrarSeleccionado(cuenta: any) {
    this.formularioCierre.get('cuenta')?.setValue(cuenta.cuenta_id);
    this.cuentaNombre = cuenta.cuenta_nombre;
    this.cuentaCodigo = cuenta.cuenta_codigo;
    this.changeDetectorRef.detectChanges();
  }

  limpiarCuentaCobrarSeleccionado() {
    this.formularioCierre.get('cuenta')?.setValue(null);
    this.cuentaNombre = '';
    this.cuentaCodigo = '';
    this.changeDetectorRef.detectChanges();
  }

  abrirModalResultados(content: any) {
    this._abrirModal(content);
  }

  private _abrirModal(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  enviarFormularioResultados() {
    this.facturaService
      .cargarResultados(this.formularioResultado.value)
      .subscribe((response) => {
        this.consultardetalle();
      this.alertaService.mensajaExitoso('Resultados cargados con exito!');
      });
  }

  agregarCuentaDesdeSeleccionado(cuenta: any) {
    this.formularioResultado.get('cuenta_desde_id')?.setValue(cuenta.cuenta_id);
    this.cuentaDesdeNombre = cuenta.cuenta_nombre;
    this.cuentaDesdeCodigo = cuenta.cuenta_codigo;
    this.changeDetectorRef.detectChanges();
  }

  limpiarCuentaDesdeSeleccionado() {
    this.formularioResultado.get('cuenta_desde_id')?.setValue(null);
    this.cuentaDesdeNombre = '';
    this.cuentaDesdeCodigo = '';
    this.changeDetectorRef.detectChanges();
  }

  agregarCuentaHastaSeleccionado(cuenta: any) {
    this.formularioResultado.get('cuenta_hasta_id')?.setValue(cuenta.cuenta_id);
    this.cuentaHastaNombre = cuenta.cuenta_nombre;
    this.cuentaHastaCodigo = cuenta.cuenta_codigo;
    this.changeDetectorRef.detectChanges();
  }

  limpiarCuentaHastaSeleccionado() {
    this.formularioResultado.get('cuenta_hasta_id')?.setValue(null);
    this.cuentaHastaNombre = '';
    this.cuentaHastaCodigo = '';
    this.changeDetectorRef.detectChanges();
  }
}
