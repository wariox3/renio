import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { InquilinoUsuariosInvicionAceptada } from '@interfaces/usuario/inquilino';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { tap } from 'rxjs';

@Component({
  selector: 'app-empresa-invitacion',
  templateUrl: './empresa-invitacion.component.html',
  styleUrls: ['./empresa-invitacion.component.scss'],
})
export class EmpresaInvitacionComponent extends General implements OnInit {
  arrInvitaciones: InquilinoUsuariosInvicionAceptada[] = [];
  formularioEmpresaInvitacion: FormGroup;
  inquilino_nombre: string;
  usuarioCodigo = '';
  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.inquilino_nombre =
      this.activatedRoute.snapshot.paramMap.get('inquilino_nombre')!;

    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.usuarioCodigo = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
    this.consultarLista();
  }

  consultarLista() {
    let inquilino_codigo =
      this.activatedRoute.snapshot.paramMap.get('inquilino_codigo')!;
    this.empresaService
      .listaInvitaciones(inquilino_codigo)
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
      this.activatedRoute.snapshot.paramMap.get('inquilino_codigo')!;

    if (this.formularioEmpresaInvitacion.valid) {
      this.empresaService
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
        'Eliminar usuario de esta empresa',
        'Este proceso no tiene reversa',
        'warning'
      )
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.empresaService
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
