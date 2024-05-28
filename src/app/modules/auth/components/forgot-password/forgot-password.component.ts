import { Component, OnInit, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { General } from '@comun/clases/general';
import { catchError, of, tap } from 'rxjs';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends General implements OnInit {

  ocultarFormularioRestablecerClave = false
  formularioRestablecerClave: FormGroup;
  visualizarLoader: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    super()
  }

  ngOnInit(): void {
    this.initForm();
  }

  get formFields() {
    return this.formularioRestablecerClave.controls;
  }

  initForm() {
    this.formularioRestablecerClave = this.formBuilder.group({
      usuario: [
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

  submit() {
    if (this.formularioRestablecerClave.valid) {
      this.visualizarLoader = true;
      this.authService
      .recuperarClave(this.formFields.usuario.value)
      .pipe(
        tap(() => {
          this.visualizarLoader = false;
          this.alertaService.mensajaExitoso(this.translateService.instant('FORMULARIOS.MENSAJES.AUTENTIFICACION.VERIFICACION'));
          this.changeDetectorRef.detectChanges();
        }),
        catchError(() => {
          this.visualizarLoader = false;
          this.changeDetectorRef.detectChanges();
          return of(null);
        })
      )
      .subscribe();
    } else {
      this.formularioRestablecerClave.markAllAsTouched()
    }

  }
}
