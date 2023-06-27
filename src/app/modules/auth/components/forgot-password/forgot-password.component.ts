import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertaService } from '@comun/services/alerta.service';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  formularioRestablecerClave: FormGroup;
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private renderer2: Renderer2,
    private router: Router,
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
    if (this.formularioRestablecerClave.valid) {
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
      this.authService
      .recuperarClave(this.formFields.usuario.value)
      .subscribe({
        next: () => {
          this.renderer2.removeAttribute(this.btnGuardar.nativeElement, 'disabled');
          this.renderer2.setProperty(
            this.btnGuardar.nativeElement,
            'innerHTML',
            'Reestablecer'
          );
          this.alertaService.mensajeValidacion(this.formFields.usuario.value);
        },
        error: ({ error }) => {
          this.renderer2.removeAttribute(this.btnGuardar.nativeElement, 'disabled');
          this.renderer2.setProperty(
            this.btnGuardar.nativeElement,
            'innerHTML',
            'Reestablecer'
          );
          this.alertaService.mensajeError(
            'Error verificación',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          );
        },
      });
    } else {
      this.formularioRestablecerClave.markAllAsTouched()
    }

  }
}
