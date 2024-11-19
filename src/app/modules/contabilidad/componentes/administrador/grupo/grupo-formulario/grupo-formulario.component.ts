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
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezadoFormularioNuevo/encabezadoFormularioNuevo.component';
import { cambiarVacioPorNulo } from '@comun/validaciones/campoNoObligatorio';
import { ConGrupo } from '@interfaces/contabilidad/contabilidad-grupo.interface';
import { GrupoService } from '@modulos/contabilidad/servicios/grupo.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-grupo-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    EncabezadoFormularioNuevoComponent
],
  templateUrl: './grupo-formulario.component.html',
  styleUrl: './grupo-formulario.component.scss',
})
export default class GrupoFormularioComponent
  extends General
  implements OnInit
{
  formularioConGrupo: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private grupoService: GrupoService
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
    this.formularioConGrupo = this.formBuilder.group({
      nombre: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      codigo: [null, Validators.compose([Validators.maxLength(20), cambiarVacioPorNulo.validar])],
    });
  }

  formSubmit() {
    if (this.formularioConGrupo.valid) {
      if (this.detalle) {
        this.grupoService
          .actualizarDatos(this.detalle, this.formularioConGrupo.value)
          .subscribe((respuesta: ConGrupo) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`/administrador/detalle`], {
                queryParams: {
                  ...parametro,
                  detalle: respuesta.id,
                },
              });
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.grupoService
          .guardarGrupo(this.formularioConGrupo.value)
          .pipe(
            tap((respuesta: ConGrupo) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.activatedRoute.queryParams.subscribe((parametro) => {
                this.router.navigate([`/administrador/detalle`], {
                  queryParams: {
                    ...parametro,
                    detalle: respuesta.id,
                  },
                });
              });
            })
          )
          .subscribe();
      }
    } else {
      this.formularioConGrupo.markAllAsTouched();
    }
  }

  consultardetalle() {
    this.grupoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: ConGrupo) => {
        this.formularioConGrupo.patchValue({
          nombre: respuesta.nombre,
          codigo: respuesta.codigo
        });
        this.changeDetectorRef.detectChanges();
      });
  }
}
