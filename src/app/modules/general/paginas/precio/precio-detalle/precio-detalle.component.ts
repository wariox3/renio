import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
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
import { PrecioDetalle } from '@modulos/general/interfaces/precio';

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
  precioDetalle = signal<PrecioDetalle[]>([]);
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
    this.consultarPrecioDetalles();
    this.consultardetalle();
  }
  iniciarFormulario() {
    this.formularioPrecio = this.formBuilder.group({
      detalles: this.formBuilder.array([])
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
    // const detalles = this.formularioPrecio.value.detalles;
    // this.precioService
    // .guardarPrecioDetalle(this.detalle, detalles).subscribe()
  }

  agregarProductos() {
    const detalleFormGroup = this.formBuilder.group({
      item: [null],
      nombre: [null],
      precio: [null],
      vr_precio: [null],
      id: [null],
    });
    this.detalles.push(detalleFormGroup);
    this.changeDetectorRef.detectChanges();
  }

  agregarItemSeleccionado(item: any, index: number) {
    this.detalles.controls[index].patchValue({
      item: item.id,
      nombre: item.nombre,
      precio: this.precio.id,
      vr_precio: item.precio,
    });

    if (this.detalles.controls[index].value.id) {
      this.actualizarItemLista(index);
    } else {
      this.guardarItemLista(this.detalles.controls[index].value);
    }
    this.changeDetectorRef.detectChanges();
  }

  eliminarProducto(index: number, id: number | null) {
    if(id){
      this.eliminarItemLista(id);
    }else{
      this.detalles.removeAt(index);
    }
  }

  guardarItemLista(item: any) {
    this.precioService
    .guardarPrecioDetalle(item).subscribe(
      (respuesta) => {
        this.consultarPrecioDetalles()
        this.changeDetectorRef.detectChanges();
      }
    )
  }

  actualizarItemLista(index: number) {
    this.precioService.actualizarPrecioDetalle(this.detalles.controls[index].value.id, this.detalles.controls[index].value).subscribe(
      (respuesta) => {
       this.alertaService.mensajaExitoso("Actualizado correctamente"); 
      }
    )
  }

  consultarPrecioDetalles() { 
    this.precioService
    .consultarPrecioDetalles(this.detalle)
    .subscribe((respuesta) => {
      this.precioDetalle.set(respuesta.results);
      this.detalles.clear();
      respuesta.results.forEach((detalle: PrecioDetalle) => {
        this.detalles.push(this.formBuilder.group({
          item: [detalle.item],
          nombre: [detalle.item__nombre],
          precio: [detalle.precio],
          vr_precio: [detalle.vr_precio],
          id: [detalle.id],
        }));
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  eliminarItemLista(id: number) {
    this.precioService.eliminarPrecioDetalle(id).subscribe(
      (respuesta) => {
        this.consultarPrecioDetalles()
        this.changeDetectorRef.detectChanges();
      }
    )
  }
}
