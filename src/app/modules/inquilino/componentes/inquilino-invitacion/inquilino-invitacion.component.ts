import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { InquilinoUsuariosInvicionAceptada } from '@interfaces/usuario/inquilino';
import { InquilinoService } from '@modulos/inquilino/servicios/inquilino.service';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { tap } from 'rxjs';

@Component({
  selector: 'app-inquilino-invitacion',
  templateUrl: './inquilino-invitacion.component.html',
  styleUrls: ['./inquilino-invitacion.component.scss'],
})
export class InquilinoInvitacionComponent extends General implements OnInit {
  arrInvitaciones: InquilinoUsuariosInvicionAceptada[] = [];
  formularioEmpresaInvitacion: FormGroup;
  inquilinoNombre: string;
  usuarioCodigo = '';
  constructor(
    private formBuilder: FormBuilder,
    private inquilinoService: InquilinoService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.inquilinoNombre =
      this.activatedRoute.snapshot.paramMap.get('inquilinoNombre')!;
    this.consultarLista();
  }

  consultarLista() {
    let inquilinoCodigo =
      this.activatedRoute.snapshot.paramMap.get('inquilinoCodigo')!;
      this.inquilinoService
      .listaInvitaciones(inquilinoCodigo)
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
    let inquilino_id =
      this.activatedRoute.snapshot.paramMap.get('inquilinoCodigo')!;
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.usuarioCodigo = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });

    if (this.formularioEmpresaInvitacion.valid) {
      this.inquilinoService
        .enviarInvitacion({
          inquilino_id: inquilino_id,
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
        'Eliminar usuario de esta inquilino',
        'Este proceso no tiene reversa',
        'warning'
      )
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.inquilinoService
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
