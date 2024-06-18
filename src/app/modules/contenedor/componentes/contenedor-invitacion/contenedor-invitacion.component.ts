import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnimationFadeinUpDirective } from '@comun/Directive/AnimationFadeinUp.directive';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ContenedorUsuariosInvicionAceptada } from '@interfaces/usuario/contenedor';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';

import { TranslateModule } from '@ngx-translate/core';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { tap } from 'rxjs';

@Component({
  selector: 'app-contenedor-invitacion',
  templateUrl: './contenedor-invitacion.component.html',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    CardComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AnimationFadeinUpDirective,
]
})
export class ContenedorInvitacionComponent extends General implements OnInit {
  arrInvitaciones: ContenedorUsuariosInvicionAceptada[] = [];
  formularioEmpresaInvitacion: FormGroup;
  contenedorNombre: string;
  usuarioCodigo = '';
  constructor(
    private formBuilder: FormBuilder,
    private contenedorService: ContenedorService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.contenedorNombre =
      this.activatedRoute.snapshot.paramMap.get('contenedorNombre')!;
    this.consultarLista();
  }

  consultarLista() {
    let contenedorCodigo =
      this.activatedRoute.snapshot.paramMap.get('contenedorCodigo')!;
      this.contenedorService
      .listaInvitaciones(contenedorCodigo)
      .subscribe((respuesta: any) => {
        this.arrInvitaciones = respuesta.usuarios;
        this.changeDetectorRef.detectChanges();
      });
  }

  get formFields() {
    return this.formularioEmpresaInvitacion.controls;
  }

  initForm() {
    this.formularioEmpresaInvitacion = this.formBuilder.group({
      nombre: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ]),
      ],
    });
  }

  formSubmit() {
    let contenedor_id =
      this.activatedRoute.snapshot.paramMap.get('contenedorCodigo')!;
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.usuarioCodigo = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });

    if (this.formularioEmpresaInvitacion.valid) {
      this.contenedorService
        .enviarInvitacion({
          contenedor_id: contenedor_id,
          invitado: this.formFields.nombre.value,
          usuario_id: this.usuarioCodigo,
        })
        .subscribe(() => {
          this.alertaService.mensajaExitoso(
            `Se ha enviado un correo de invitación.`
          );
          this.consultarLista();
          this.formularioEmpresaInvitacion.reset();
        });
    } else {
      this.formularioEmpresaInvitacion.markAllAsTouched();
    }
  }

  eliminarInvitado(usuario_id: Number) {
    this.alertaService
      .mensajeValidacion(
        'Eliminar usuario de esta contenedor',
        'Este proceso no tiene reversa',
        'warning'
      )
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.contenedorService
            .eliminarEmpresaUsuario(usuario_id)
            .pipe(
              tap(() => {
                this.alertaService.mensajaExitoso(
                  this.translateService.instant(
                    'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOELIMINACION'
                  )
                );
                this.consultarLista();
              })
            )
            .subscribe();
        }
      });
  }
}
