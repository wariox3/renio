import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ComprobanteService } from '@modulos/contabilidad/servicios/comprobante.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-comprobante-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ImpuestosComponent,
    BtnAtrasComponent,
    CardComponent,
  ],
  templateUrl: './comprobante-formulario.component.html',
  styleUrl: './comprobante-formulario.component.scss',
})
export default class ComprobanteFormularioComponent
  extends General
  implements OnInit
{
  formularioComprobante: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private comprobanteService: ComprobanteService
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
    this.formularioComprobante = this.formBuilder.group({
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
      codigo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(200)]),
      ],
      permite_asiento: [false],
    });
  }

  formSubmit() {
    if (this.formularioComprobante.valid) {
      if (this.detalle) {
        this.comprobanteService
          .actualizarDatos(this.detalle, this.formularioComprobante.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.router.navigate(['/administrador/detalle'], {
              queryParams: {
                modulo: this.activatedRoute.snapshot.queryParams['modulo'],
                modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                detalle: respuesta.id,
              },
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.comprobanteService
          .guardarComprobante(this.formularioComprobante.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.router.navigate(['/administrador/detalle'], {
                queryParams: {
                  modulo: this.activatedRoute.snapshot.queryParams['modulo'],
                  modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                  tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                  detalle: respuesta.id,
                  accion: 'detalle',
                },
              });
            })
          )
          .subscribe();
      }
    } else {
      this.formularioComprobante.markAllAsTouched();
    }
  }

  consultardetalle() {
    this.comprobanteService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioComprobante.patchValue({
          nombre: respuesta.nombre,
        });
        this.changeDetectorRef.detectChanges();
      });
  }
}
