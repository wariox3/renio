import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Precio } from '@modulos/general/interfaces/precio.interface';
import { PrecioService } from '@modulos/general/servicios/precio.service';

import { TranslateModule } from '@ngx-translate/core';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { ProductosComponent } from '@comun/componentes/productos/productos.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { EncabezadoFormularioNuevoComponent } from "@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component";
import { TituloAccionComponent } from "../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-precio-detalle',
  standalone: true,
  templateUrl: './precio-detalle.component.html',
  styleUrls: ['./precio-detalle.component.scss'],
  imports: [
    CommonModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    NgbNavModule,
    ProductosComponent,
    FormsModule,
    ReactiveFormsModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent
],
})
export default class PrecioDetalleComponent extends General implements OnInit {
  precio: Precio = {
    id: 0,
    tipo: '',
    fecha_vence: undefined,
    nombre: '',
  };
  active: Number = 1;
  formularioPrecio: FormGroup;

  constructor(
    private precioService: PrecioService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    this.consultardetalle();
  }
  iniciarFormulario() {
    this.formularioPrecio = this.formBuilder.group({
      detalles: this.formBuilder.array([]),
    });
  }

  get detalles() {
    return this.formularioPrecio.get('detalles') as FormArray;
  }

  consultardetalle() {
    this.precioService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.precio = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  enviarFormulario() {
    this.precioService
    .guardarPrecioDetalle(this.detalle, this.formularioPrecio.value).subscribe()
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

  eliminarProducto(index: number, id: number | null) {
    this.detalles.removeAt(index);
  }
}
