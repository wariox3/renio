import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { EmpresaUsuariosInvicionAceptada } from '@interfaces/usuario/empresa';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { tap } from 'rxjs';

@Component({
  selector: 'app-empresa-invitacion',
  templateUrl: './empresa-invitacion.component.html',
  styleUrls: ['./empresa-invitacion.component.scss'],
})
export class EmpresaInvitacionComponent extends General implements OnInit {
  arrInvitaciones: EmpresaUsuariosInvicionAceptada[] = [

  ]
  formularioEmpresaInvitacion: FormGroup;
  empresa_nombre = ""
  usuarioCodigo = '';
  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
  ) {
    super()
  }

  ngOnInit(): void {
    this.initForm();
    this.empresa_nombre = this.activatedRoute.snapshot.paramMap.get('nombreempresa')!;

    this.store.select(obtenerId).subscribe((codigoUsuario) => {
      this.usuarioCodigo = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
    this.consultarLista();
  }

  consultarLista() {
    let empresaCodigo =
    this.activatedRoute.snapshot.paramMap.get('codigoempresa')!;
    this.empresaService.listaInvitaciones(empresaCodigo).subscribe((respuesta: any) => {
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
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
        ]),
      ],
    });
  }

  formSubmit() {
    let empresaCodigo =
      this.activatedRoute.snapshot.paramMap.get('codigoempresa')!;

    if (this.formularioEmpresaInvitacion.valid) {
      this.empresaService
        .enviarInvitacion({
          empresa_id: empresaCodigo,
          invitado: this.formFields.nombre.value,
          usuario_id: this.usuarioCodigo,
        })
        .subscribe(() => {
          this.alertaService.mensajaExitoso(

            `Se ha enviado un correo de invitación.`
          );
          this.consultarLista()
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
          this.empresaService.eliminarEmpresaUsuario(usuario_id)
          .pipe(
            tap(()=>{
              this.alertaService.mensajaExitoso(this.translateService.instant("FORMULARIOS.MENSAJES.COMUNES.PROCESANDOELIMINACION")
              );
              this.consultarLista()
            })
          )
          .subscribe();
        }
      });
  }

}
