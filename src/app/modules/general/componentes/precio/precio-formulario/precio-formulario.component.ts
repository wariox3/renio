import { PrecioService } from '@modulos/general/servicios/precio.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { General } from '@comun/clases/general';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-precio-formulario',
  standalone: true,
  imports: [CommonModule, BtnAtrasComponent, CardComponent],
  templateUrl: './precio-formulario.component.html',
})
export default class PrecioFormularioComponent
  extends General
  implements OnInit
{
  formularioPrecio: FormGroup;

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
      tipo: [''],
      fecha_vence: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
    });
  }

  enviarFormulario() {}

  consultardetalle() {
    this.precioService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioPrecio.patchValue({
          codigo: respuesta.item.codigo,
          nombre: respuesta.item.nombre,
          referencia: respuesta.item.referencia,
          precio: respuesta.item.precio,
          costo: respuesta.item.costo,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
