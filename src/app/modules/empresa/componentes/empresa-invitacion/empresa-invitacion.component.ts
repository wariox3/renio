import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertaService } from '@comun/services/alerta.service';
import { EmpresaUsuariosInvicionAceptada } from '@interfaces/usuario/empresa';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { Store } from '@ngrx/store';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { tap } from 'rxjs';

@Component({
  selector: 'app-empresa-invitacion',
  templateUrl: './empresa-invitacion.component.html',
  styleUrls: ['./empresa-invitacion.component.scss'],
})
export class EmpresaInvitacionComponent implements OnInit {
  arrInvitaciones: EmpresaUsuariosInvicionAceptada[] = [

  ]
  formularioEmpresaInvitacion: FormGroup;
  usuarioCodigo = '';
  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private alertaService: AlertaService,
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initForm();
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
            'Invitación exitosa',
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
        'Eliminar empresa',
        'Este proceso no tiene reversa',
        'warning'
      )
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.empresaService.eliminarEmpresaUsuario(usuario_id)
          .pipe(
            tap(()=>{
              this.alertaService.mensajaExitoso('Usuario eliminado', 'Por favor espere, procesando eliminación');
              this.consultarLista()
            })
          )
          .subscribe();
        }
      });
  }

}
