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
import { GrupoService } from '@modulos/humano/servicios/grupo.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-grupo',
  standalone: true,
  imports: [
    CommonModule,
    BtnAtrasComponent,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
  ],
  templateUrl: './grupo-formulario.component.html',
  styleUrl: './grupo-formulario.component.scss',
})
export default class GrupoFormularioComponent
  extends General
  implements OnInit
{
  formularioGrupo: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private grupoService: GrupoService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();

    if (this.detalle) {
      this.consultarDetalle();
    }
  }

  iniciarFormulario() {
    this.formularioGrupo = this.formBuilder.group({
      nombre: ['', Validators.compose([Validators.required])],
    });
  }

  enviarFormulario() {
    if (this.formularioGrupo.valid) {
      if (this.detalle) {
        this.grupoService
          .actualizarDatosGrupo(this.detalle, this.formularioGrupo.value)
          .subscribe((respuesta) => {
            this.formularioGrupo.patchValue({
              empleado: respuesta.contacto_id,
              empleadoNombre: respuesta.contado_nombre_corto,
              fecha_desde: respuesta.fecha_desde,
              fecha_hasta: respuesta.fecha_hasta,
            });
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
        this.grupoService
          .guardarGrupo(this.formularioGrupo.value)
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
      this.formularioGrupo.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.grupoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioGrupo.patchValue({
          nombre: respuesta.nombre,
        });

        this.changeDetectorRef.detectChanges();
      });
  }
}
