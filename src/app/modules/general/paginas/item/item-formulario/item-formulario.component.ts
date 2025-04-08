import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarConCuenta } from '@interfaces/comunes/autocompletar/contabilidad/con-cuenta.interface';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { ItemService } from '@modulos/general/servicios/item.service';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Subject, takeUntil, tap } from 'rxjs';
import { CuentasComponent } from '../../../../../comun/componentes/cuentas/cuentas.component';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Rutas } from '@interfaces/menu/configuracion.interface';

@Component({
  selector: 'app-item-formulario',
  standalone: true,
  templateUrl: './item-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ImpuestosComponent,
    CardComponent,
    NgxMaskDirective,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent,
    NgbDropdownModule,
    CuentasComponent,
  ],
  providers: [provideNgxMask()],
})
export default class ItemFormularioComponent
  extends General
  implements OnInit, AfterViewInit, OnDestroy
{
  private readonly _generalService = inject(GeneralService);
  private readonly _configModuleService = inject(ConfigModuleService);

  arrCuentasLista: any[];
  formularioItem: FormGroup;
  arrImpuestosEliminado: number[] = [];
  arrImpuestos: any[] = [];
  cuentaCodigo = '';
  cuentaNombre = '';
  cuentaCobrarCodigo = '';
  cuentaCobrarNombre = '';
  @Input() informacionFormulario: any;
  @Input() itemTipo: 'compra' | 'venta' = 'venta';
  @Input() ocultarBtnAtras = false;
  @Input() tituloFijo: Boolean = false;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputImpuestos', { static: false })
  inputImpuestos: HTMLInputElement;
  @ViewChild('inputNombre', { read: ElementRef })
  inputNombre: ElementRef<HTMLInputElement>;

  public valorInventarioDefecto = signal<boolean>(false);
  public valorServicioDefecto = signal<boolean>(false);
  public valorProductoDefecto = signal<boolean>(false);
  public itemEnUso = signal<boolean>(false);
  private _destroy$ = new Subject<void>();
  private _rutas: Rutas | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService,
  ) {
    super();
  }

  ngOnInit() {
    this.configurarModuloListener();
    this.iniciarFormulario();
    if (this.detalle && this.ocultarBtnAtras === false) {
      this.consultardetalle();
      this._consultarItemUso(this.detalle);
    } else {
      this._getCuentaLista([
        {
          propiedad: 'permite_movimiento',
          valor1: true,
        },
        {
          propiedad: 'cuenta_clase',
          valor1: 4,
        },
      ]).subscribe({
        next: (respuesta) => {
          this.arrCuentasLista = respuesta.registros;
          this._sugerirCampoCuentaVenta();
        },
      });
    }

    this._initCamposReactivos();
  }

  private configurarModuloListener() {
    this._configModuleService.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((modeloConfig) => {
        this._rutas = modeloConfig?.ajustes.rutas;
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.accion === 'nuevo') {
      if (this.inputNombre?.nativeElement.value === '') {
        this.inputNombre?.nativeElement.focus();
      }
    }
  }

  private _consultarItemUso(id: number) {
    this.itemService.consultarItemUso(id).subscribe((response) => {
      if (response.uso) {
        this._inhabilitarCampos();
      }
    });
  }

  private _inhabilitarCampos() {
    this.itemEnUso.set(true);
    this.formularioItem.get('inventario')?.disable();
    this.formularioItem.get('productoServicio')?.disable();
  }

  private _initCamposReactivos() {
    this._handleCampoServicio();
    this._handleCampoInventario();
  }

  private _handleCampoServicio() {
    this.formularioItem.get('servicio')?.valueChanges.subscribe((value) => {
      const inventarioControl = this.formularioItem.get('inventario');

      if (value) {
        inventarioControl?.setValue(false, { emitEvent: false });
      } else {
        if (!this.detalle) {
          inventarioControl?.setValue(true, {
            emitEvent: false,
          });
        } else {
          inventarioControl?.setValue(this.valorInventarioDefecto(), {
            emitEvent: false,
          });
        }
      }
    });
  }

  private _handleCampoInventario() {
    this.formularioItem.get('inventario')?.valueChanges.subscribe((value) => {
      const esServicio = this.formularioItem.get('servicio')?.value;
      const inventarioControl = this.formularioItem.get('inventario');
      if (esServicio) {
        inventarioControl?.setValue(false, { emitEvent: false });
      } else {
        inventarioControl?.setValue(value, { emitEvent: false });
      }
    });
  }

  iniciarFormulario() {
    this.formularioItem = this.formBuilder.group({
      codigo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
      referencia: [null, Validators.compose([Validators.maxLength(50)])],
      precio: [0, Validators.compose([Validators.pattern(/^[0-9.]+$/)])],
      costo: [0, Validators.compose([Validators.pattern(/^[0-9.]+$/)])],
      productoServicio: ['producto'],
      producto: [true],
      servicio: [false],
      inventario: [true],
      negativo: [false],
      impuestos: this.formBuilder.array([]),
      cuenta_venta: [null],
      cuenta_compra: [null],
      favorito: [false],
      inactivo: [false],
      venta: [false],
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioItem.controls;
  }

  enviarFormulario() {
    if (this.formularioItem.valid) {
      if (this.detalle && this.ocultarBtnAtras === false) {
        this.itemService
          .actualizarDatosItem(
            this.detalle,
            {
              ...this.formularioItem.value,
              ...{ impuestos_eliminados: this.arrImpuestosEliminado },
            },
          )
          .subscribe((respuesta) => {
            this.formularioItem.patchValue({
              codigo: respuesta.item.codigo,
              nombre: respuesta.item.nombre,
              referencia: respuesta.item.referencia,
              precio: respuesta.item.precio,
            });

            let arrImpuesto = this.obtenerFormularioCampos
              .impuestos as FormArray;

            arrImpuesto.clear();

            respuesta.item.impuestos.map((impuesto: any) => {
              arrImpuesto.push(
                this.formBuilder.group({
                  impuesto: impuesto,
                }),
              );
            });
            this.arrImpuestos = respuesta.item.impuestos;
            this.arrImpuestosEliminado = [];
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              let parametrosActuales = { ...parametro };

              this.router.navigate([`${this._rutas?.lista}`], {
                queryParams: { ...parametrosActuales },
              });
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.itemService
          .guardarItem(this.formularioItem.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              if (this.ocultarBtnAtras) {
                const impuestosDiscriminados =
                  this._discriminarImpuestosPorTipo(
                    this.itemTipo,
                    respuesta?.item?.impuestos,
                  );

                const respuestaItem = {
                  item: {
                    ...respuesta.item,
                    impuestos: impuestosDiscriminados,
                  },
                };

                this.emitirGuardoRegistro.emit(respuestaItem); // necesario para cerrar el modal que está en editarEmpresa
              } else {
                this.activatedRoute.queryParams.subscribe((parametro) => {
                  let parametrosActuales = { ...parametro };
                  this.router.navigate([`${this._rutas?.lista}`], {
                    queryParams: { ...parametrosActuales },
                  });
                });
              }
            }),
          )
          .subscribe();
      }
    } else {
      this.formularioItem.markAllAsTouched();
    }
  }

  private _discriminarImpuestosPorTipo(
    itemTipo: 'venta' | 'compra',
    impuestosItem: any[],
  ) {
    switch (itemTipo) {
      case 'compra':
        return this._filtrarImpuestosPorNombre(
          'impuesto_compra',
          impuestosItem,
        );
      case 'venta':
      default:
        return this._filtrarImpuestosPorNombre('impuesto_venta', impuestosItem);
    }
  }

  private _filtrarImpuestosPorNombre(
    nombreImpuesto: string,
    impuestosItem: any[],
  ) {
    return impuestosItem.filter((item) => item[nombreImpuesto]);
  }

  limpiarFormulario() {
    this.formularioItem.reset();
  }

  agregarImpuesto(impuesto: any) {
    const arrImpuesto = this.formularioItem.get('impuestos') as FormArray;
    let impuestoFormGrup = this.formBuilder.group({
      impuesto: [impuesto.impuesto_id],
    });
    arrImpuesto.push(impuestoFormGrup);

    this.changeDetectorRef.detectChanges();
  }

  removerImpuesto(impuesto: any) {
    const arrImpuesto = this.formularioItem.get('impuestos') as FormArray;

    let nuevosImpuestos = arrImpuesto.value.filter(
      (item: any) =>
        item.impuesto !== impuesto.id || item.impuesto !== impuesto.impuesto_id,
    );

    // Limpiar el FormArray actual
    arrImpuesto.clear();

    nuevosImpuestos.forEach((item: any) => {
      const nuevoDetalle = this.formBuilder.group({
        // Aquí debes definir la estructura de tu FormGroup para un impuesto
        impuesto: [item.impuesto],
      });
      arrImpuesto.push(nuevoDetalle);
    });

    if (impuesto.id != null) {
      this.arrImpuestosEliminado.push(impuesto.id);
    }

    this.changeDetectorRef.detectChanges();
  }

  consultardetalle() {
    this.itemService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.valorInventarioDefecto.set(respuesta.item.inventario);
        this.valorProductoDefecto.set(respuesta.item.producto);
        this.valorServicioDefecto.set(respuesta.item.servicio);
        this.formularioItem.patchValue({
          codigo: respuesta.item.codigo,
          nombre: respuesta.item.nombre,
          referencia: respuesta.item.referencia,
          precio: respuesta.item.precio,
          costo: respuesta.item.costo,
          productoServicio: respuesta.item.producto ? 'producto' : 'servicio',
          inventario: respuesta.item.inventario,
          producto: respuesta.item.producto,
          servicio: respuesta.item.servicio,
          negativo: respuesta.item.negativo,
          venta: respuesta.item.venta,
          favorito: respuesta.item.favorito,
          inactivo: respuesta.item.inactivo,
          cuenta_venta: respuesta.item.cuenta_venta_id,
          cuenta_compra: respuesta.item.cuenta_compra_id,
        });

        this.cuentaCodigo = respuesta.item.cuenta_venta_codigo;
        this.cuentaNombre = respuesta.item.cuenta_venta_nombre;
        this.cuentaCobrarCodigo = respuesta.item.cuenta_compra_codigo;
        this.cuentaCobrarNombre = respuesta.item.cuenta_compra_nombre;

        let arrImpuesto = this.obtenerFormularioCampos.impuestos as FormArray;

        arrImpuesto.clear();

        respuesta.item.impuestos.map((impuesto: any) => {
          arrImpuesto.push(
            this.formBuilder.group({
              impuesto: impuesto,
            }),
          );
        });
        this.arrImpuestos = respuesta.item.impuestos;
        // this.calcularTotales();
        this.changeDetectorRef.detectChanges();
      });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioItem?.markAsDirty();
    this.formularioItem?.markAsTouched();
    if (campo === 'referencia') {
      if (this.formularioItem.get(campo)?.value === '') {
        this.formularioItem.get(campo)?.setValue(null);
      }
    }
    if (campo === 'producto' && !this.itemEnUso()) {
      this.formularioItem.get(campo)?.setValue(true);
      this.formularioItem.get('servicio')?.setValue(false);
    }
    if (campo === 'servicio' && !this.itemEnUso()) {
      this.formularioItem.get(campo)?.setValue(true);
      this.formularioItem.get('producto')?.setValue(false);
    }
    if (campo === 'precio' || campo === 'costo') {
      if (this.formularioItem.get(campo)?.value === '') {
        this.formularioItem.get(campo)?.setValue(dato);
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  private _getCuentaLista(filtros: Filtros[]) {
    return this._generalService.consultarDatosAutoCompletar({
      modelo: 'ConCuenta',
      serializador: 'ListaAutocompletar',
      limite: 10,
      desplazar: 0,
      ordenamientos: ['codigo'],
      limite_conteo: 10000,
      filtros,
    });
  }

  consultarCuentas(event: any) {
    const valor = event?.target?.value;
    const valorBusqueda = valor.split(' ')?.[0] || '';

    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'permite_movimiento',
          valor1: true,
        },
        {
          propiedad: 'cuenta_clase',
          valor1: 4,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: ['codigo'],
      limite_conteo: 10000,
      modelo: 'ConCuenta',
      serializador: 'ListaAutocompletar',
    };

    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarConCuenta>(arrFiltros)
      .subscribe((respuesta) => {
        this.arrCuentasLista = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosCuentas(event: any) {
    const valor = event?.target?.value;
    const valorCasteado = Number(valor);
    const filtros = [];

    if (!valor) {
      this.formularioItem.get('cuenta_venta')?.setValue(null);
    }

    // la busqueda es por codigo
    if (!isNaN(valorCasteado)) {
      filtros.push({
        propiedad: 'codigo__startswith',
        valor1: `${valor}`,
      });
    } else {
      // la busqueda es por texto
      filtros.push({
        propiedad: 'nombre__icontains',
        valor1: `${valor}`,
      });
    }

    let arrFiltros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'permite_movimiento',
          valor1: true,
        },
        {
          propiedad: 'cuenta_clase',
          valor1: 4,
        },
        ...filtros,
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: ['codigo'],
      limite_conteo: 10000,
      modelo: 'ConCuenta',
      serializador: 'ListaAutocompletar',
    };

    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarConCuenta>(arrFiltros)
      .pipe(
        tap((respuesta) => {
          this.arrCuentasLista = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  construirNombre() {
    const cuentaCodigo = this.cuentaCodigo || '';
    const cuentaNombre = this.cuentaNombre || '';
    if (!cuentaCodigo && !cuentaNombre) {
      return null;
    }
    return `${cuentaCodigo} ${cuentaNombre}`;
  }

  agregarCuenta(cuenta: any) {
    this.formularioItem.get('cuenta_venta')?.setValue(cuenta.cuenta_id);
    this.cuentaNombre = cuenta.cuenta_nombre;
    this.cuentaCodigo = cuenta.cuenta_codigo;
    this.changeDetectorRef.detectChanges();
  }

  private _sugerirCampoCuentaVenta() {
    if (this.arrCuentasLista.length > 0) {
      const registroSugerido = this.arrCuentasLista[0];

      this.agregarCuenta(registroSugerido);
    }
  }

  agregarCuentaCobrarSeleccionado(cuenta: any) {
    this.formularioItem.get('cuenta_compra')?.setValue(cuenta.cuenta_id);
    this.cuentaCobrarNombre = cuenta.cuenta_nombre;
    this.cuentaCobrarCodigo = cuenta.cuenta_codigo;
    this.changeDetectorRef.detectChanges();
  }

  limpiarCuentaCobrarSeleccionado() {
    this.formularioItem.get('cuenta_compra')?.setValue(null);
    this.cuentaCobrarNombre = '';
    this.cuentaCobrarCodigo = '';
    this.changeDetectorRef.detectChanges();
  }
}
