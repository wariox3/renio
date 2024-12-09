import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
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
import { TranslateModule } from '@ngx-translate/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ItemService } from '@modulos/general/servicios/item.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { tap } from 'rxjs';
import { TituloAccionComponent } from '../../../../../comun/componentes/titulo-accion/titulo-accion.component';

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
  ],
  providers: [provideNgxMask()],
})
export default class ItemFormularioComponent extends General implements OnInit {
  formularioItem: FormGroup;
  arrImpuestosEliminado: number[] = [];
  arrImpuestos: any[] = [];
  @Input() informacionFormulario: any;
  @Input() itemTipo: 'compra' | 'venta' = 'venta';
  @Input() ocultarBtnAtras = false;
  @Input() tituloFijo: Boolean = false;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputImpuestos', { static: false })
  inputImpuestos: HTMLInputElement;

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    if (this.detalle && this.ocultarBtnAtras === false) {
      this.consultardetalle();
    }
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
      inventario: [false],
      impuestos: this.formBuilder.array([]),
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioItem.controls;
  }

  enviarFormulario() {
    if (this.formularioItem.valid) {
      if (
        this.activatedRoute.snapshot.queryParams['detalle'] &&
        this.ocultarBtnAtras === false
      ) {
        this.itemService
          .actualizarDatosItem(
            this.activatedRoute.snapshot.queryParams['detalle'],
            {
              ...this.formularioItem.value,
              ...{ impuestos_eliminados: this.arrImpuestosEliminado },
            }
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
                })
              );
            });
            this.arrImpuestos = respuesta.item.impuestos;
            this.arrImpuestosEliminado = [];
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`/administrador/detalle`], {
                queryParams: {
                  ...parametro,
                  detalle: respuesta.item.id,
                },
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
                    respuesta?.item?.impuestos
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
                  this.router.navigate([`/administrador/detalle`], {
                    queryParams: {
                      ...parametro,
                      detalle: respuesta.item.id,
                    },
                  });
                });
              }
            })
          )
          .subscribe();
      }
    } else {
      this.formularioItem.markAllAsTouched();
    }
  }

  private _discriminarImpuestosPorTipo(
    itemTipo: 'venta' | 'compra',
    impuestosItem: any[]
  ) {
    switch (itemTipo) {
      case 'compra':
        return this._filtrarImpuestosPorNombre(
          'impuesto_compra',
          impuestosItem
        );
      case 'venta':
      default:  
        return this._filtrarImpuestosPorNombre('impuesto_venta', impuestosItem);
    }
  }

  private _filtrarImpuestosPorNombre(
    nombreImpuesto: string,
    impuestosItem: any[]
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
        item.impuesto !== impuesto.id || item.impuesto !== impuesto.impuesto_id
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
        });

        let arrImpuesto = this.obtenerFormularioCampos.impuestos as FormArray;

        arrImpuesto.clear();

        respuesta.item.impuestos.map((impuesto: any) => {
          arrImpuesto.push(
            this.formBuilder.group({
              impuesto: impuesto,
            })
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
    if (campo === 'producto') {
      this.formularioItem.get(campo)?.setValue(true);
      this.formularioItem.get('servicio')?.setValue(false);
    }
    if (campo === 'servicio') {
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
}
