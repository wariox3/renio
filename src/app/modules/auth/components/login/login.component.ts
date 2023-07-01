import { Component, OnInit, OnDestroy, ChangeDetectorRef, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Token } from '@interfaces/usuario/token';
import { Store } from '@ngrx/store';
import { Usuario } from '@interfaces/usuario/usuario';
import { usuarioActionInit } from '@redux/actions/usuario.actions';
import { empresaActionInit } from '@redux/actions/empresa.actions';
import { AlertaService } from '@comun/services/alerta.service';
import { Empresa } from '@interfaces/usuario/empresa';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: '',
    password: '',
  };
  loginForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  cambiarTipoCampoClave: ("text"|"password") = "password"
  @ViewChild('btnContinuar', { read: ElementRef })
  btnContinuar!: ElementRef<HTMLButtonElement>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private alertaService: AlertaService,
    private renderer2: Renderer2,
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  visualizarClave(){
    if(this.cambiarTipoCampoClave === "password"){
      this.cambiarTipoCampoClave = 'text'
    } else{
      this.cambiarTipoCampoClave = 'password'
    }
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
          Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
        ]),
      ],
      password: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-z-A-Z-0-9@.-_]+$/),
        ]),
      ],
    });
  }

  submit() {
    if(this.loginForm.valid){
      this.renderer2.setAttribute(
        this.btnContinuar.nativeElement,
        'disabled',
        'true'
      );
      this.renderer2.setProperty(
        this.btnContinuar.nativeElement,
        'innerHTML',
        'Procesando'
      );
      this.authService
        .login(this.f.email.value, this.f.password.value)
        .subscribe({
          next: (respuesta: Token)=> {
            //actualizar el store de redux
            this.store.dispatch(
              usuarioActionInit({ usuario: {
                id: respuesta.user.id,
                username: respuesta.user.username,
                cargo: 'admin',
                imgen:
                  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/425px-Missing_avatar.svg.png',
              } })
            );
            let dominioActual = window.location.host
            let esSubdominio = dominioActual.split('.').length > 2;
            if (esSubdominio) {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/empresa/lista']);
            }
          },
        });
        this.renderer2.removeAttribute(this.btnContinuar.nativeElement, 'disabled');
        this.renderer2.setProperty(
          this.btnContinuar.nativeElement,
          'innerHTML',
          'Continuar'
        );
    } else {
      this.loginForm.markAllAsTouched()
    }

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
