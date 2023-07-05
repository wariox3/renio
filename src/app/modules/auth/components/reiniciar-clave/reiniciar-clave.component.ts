import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaService } from '@comun/services/alerta.service';
import { AuthService } from '@modulos/auth/services/auth.service';
import { Store } from '@ngrx/store';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { switchMap } from 'rxjs';
import { ConfirmPasswordValidator } from '../registration/confirm-password.validator';

@Component({
  templateUrl: './reiniciar-clave.component.html',
  styleUrls: ['./reiniciar-clave.component.scss'],
})
export class ReiniciarClaveComponent implements OnInit {

  codigo_usuario: string = ""
  inhabilitarBtnRestablecer: boolean = true
  formularioReiniciarClave: FormGroup;
  cambiarTipoCampoClave: ("text"|"password") = "password"
  cambiarTipoCampoConfirmarClave: ("text"|"password") = "password"
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;


  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private renderer2: Renderer2,
    private alertaService: AlertaService,
    private store: Store,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.validarToken();
  }

  visualizarClave(){
    if(this.cambiarTipoCampoClave === "password"){
      this.cambiarTipoCampoClave = 'text'
    } else{
      this.cambiarTipoCampoClave = 'password'
    }
  }

  visualizarConfirmarClave(){
    if(this.cambiarTipoCampoConfirmarClave === "password"){
      this.cambiarTipoCampoConfirmarClave = 'text'
    } else{
      this.cambiarTipoCampoConfirmarClave = 'password'
    }
  }

  initForm() {
    this.formularioReiniciarClave = this.formBuilder.group(
      {
        clave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        confirmarClave: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
      },
      {
        validator: ConfirmPasswordValidator.validarClave,
      }
    );
  }

  validarToken(){
    const token = this.activatedRoute.snapshot.paramMap.get('token')!;
    this.authService.validacion(token).subscribe({
      next: (respuesta: any) => {
        this.inhabilitarBtnRestablecer = false
        this.codigo_usuario = respuesta.verificacion.usuario_id,
        this.changeDetectorRef.detectChanges();

      },
      error: ({ error }) => {
        this.alertaService.mensajeError(
          'Error verificación',
          `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
        );
      },
    });
  }


  get formFields() {
    return this.formularioReiniciarClave.controls;
  }

  submit() {
    if (this.formularioReiniciarClave.valid) {
      this.renderer2.setAttribute(
        this.btnGuardar.nativeElement,
        'disabled',
        'true'
      );
      this.renderer2.setProperty(
        this.btnGuardar.nativeElement,
        'innerHTML',
        'Procesando'
      );
            this.authService.reiniciarClave(
              this.codigo_usuario,
              this.formFields.clave.value
            )
        .subscribe({
          next: (respuesta) => {
            this.renderer2.removeAttribute(this.btnGuardar.nativeElement, 'disabled');
            this.renderer2.setProperty(
              this.btnGuardar.nativeElement,
              'innerHTML',
              'Guardar'
            );
          this.alertaService.mensajaExitoso(
            'Cambio exitoso',
            `por favor ingrese con su nueva clave`
          );
          this.router.navigate(['/auth/login']);
        },
        error: ( error ) => {
          this.renderer2.removeAttribute(this.btnGuardar.nativeElement, 'disabled');
          this.renderer2.setProperty(
            this.btnGuardar.nativeElement,
            'innerHTML',
            'Guardar'
          );

          this.alertaService.mensajeError(
            'Error consulta',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          );
        },
      });
    } else {
      this.formularioReiniciarClave.markAllAsTouched();
    }
  }

}
