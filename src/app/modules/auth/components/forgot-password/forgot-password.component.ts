import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AlertaService } from '@comun/services/alerta.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  formularioRestablecerClave: FormGroup;
  @ViewChild('btnRestablecer', { read: ElementRef })
  btnRestablecer!: ElementRef<HTMLButtonElement>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private renderer2: Renderer2,
    private alertaService: AlertaService,
  ) {
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
    this.renderer2.setAttribute(
      this.btnRestablecer.nativeElement,
      'disabled',
      'true'
    );
    this.renderer2.setProperty(
      this.btnRestablecer.nativeElement,
      'innerHTML',
      'Procesando'
    );
    if (this.formularioRestablecerClave.valid) {
      this.authService
      .recuperarClave(this.formFields.usuario.value)
      .subscribe({
        next: () => {
          this.renderer2.removeAttribute(this.btnRestablecer.nativeElement, 'disabled');
          this.renderer2.setProperty(
            this.btnRestablecer.nativeElement,
            'innerHTML',
            'Reestablecer'
          );
          this.alertaService.mensajeValidacion(this.formFields.usuario.value);
        },
        error: () => {
          this.renderer2.removeAttribute(this.btnRestablecer.nativeElement, 'disabled');
          this.renderer2.setProperty(
            this.btnRestablecer.nativeElement,
            'innerHTML',
            'Reestablecer'
          );
        },
      });
    } else {
      this.renderer2.removeAttribute(this.btnRestablecer.nativeElement, 'disabled');
      this.renderer2.setProperty(
        this.btnRestablecer.nativeElement,
        'innerHTML',
        'Reestablecer'
      );
      this.formularioRestablecerClave.markAllAsTouched()
    }

  }
}
