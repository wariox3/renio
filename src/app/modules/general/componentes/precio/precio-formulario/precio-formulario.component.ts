import { PrecioService } from '@modulos/general/servicios/precio.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { General } from '@comun/clases/general';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductosComponent } from '../../../../../comun/componentes/productos/productos.component';

@Component({
  selector: 'app-precio-formulario',
  standalone: true,
  templateUrl: './precio-formulario.component.html',
  styleUrls: ['./precio-formulario.component.scss'],
  imports: [
    CommonModule,
    BtnAtrasComponent,
    CardComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
    NgbNavModule,
    ProductosComponent,
  ],
})
export default class PrecioFormularioComponent
  extends General
  implements OnInit
{
  formularioPrecio: FormGroup;
  active: Number = 1;

  constructor(
    private formBuilder: FormBuilder,
    private precioService: PrecioService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    this.formularioPrecio = this.formBuilder.group({
      tipo: ['', Validators.compose([Validators.required])],
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      fecha_vence: [null, Validators.compose([Validators.required])],
      detalles: this.formBuilder.array([]),
    });
  }

  get detalles() {
    return this.formularioPrecio.get('detalles') as FormArray;
  }

  enviarFormulario() {
    if (this.formularioPrecio.valid) {
      if (this.detalle) {
        this.precioService
          .actualizarDatos(this.detalle, this.formularioPrecio.value)
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Se actualizo la información');
            this.router.navigate(['/detalle'], {
              queryParams: {
                modulo: this.activatedRoute.snapshot.queryParams['modulo'],
                modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                formulario: `${this.activatedRoute.snapshot.queryParams['formulario']}`,
                detalle: respuesta.id,
                accion: 'detalle',
              },
            });
          });
      } else {
        this.precioService
          .guardarPrecio(this.formularioPrecio.value)
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Se actualizo la información');
            this.router.navigate(['/detalle'], {
              queryParams: {
                modulo: this.activatedRoute.snapshot.queryParams['modulo'],
                modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                formulario: `${this.activatedRoute.snapshot.queryParams['formulario']}`,
                detalle: respuesta.id,
                accion: 'detalle',
              },
            });
          });
      }
    } else {
      this.formularioPrecio.markAllAsTouched();
    }
  }

  consultardetalle() {
    this.precioService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioPrecio.patchValue({
          nombre: respuesta.nombre,
          tipo: respuesta.tipo,
          fecha_vence: respuesta.fecha_vence,
        });

        this.changeDetectorRef.detectChanges();
      });
  }

  agregarProductos() {
    const detalleFormGroup = this.formBuilder.group({
      item: [null],
      item_nombre: [null],
      item_precio: [null],
      id: [null],
    });
    this.formularioPrecio.markAsDirty();
    this.formularioPrecio?.markAsTouched();

    this.detalles.push(detalleFormGroup);
    this.changeDetectorRef.detectChanges();
  }

  agregarItemSeleccionado(item: any, index: number) {
    this.detalles.controls[index].patchValue({
      item: item.id,
      item_nombre: item.nombre,
      item_precio: item.precio,
    });

    this.formularioPrecio.markAsTouched();
    this.formularioPrecio.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }
}
