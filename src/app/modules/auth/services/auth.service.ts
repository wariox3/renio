import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Token } from '@interfaces/usuario/token';
import { TokenService } from './token.service';
import { chackRequiereToken } from '@interceptores/token.interceptor';
import { removeCookie } from 'typescript-cookie';
import { TokenVerificacion } from '../models/token-verificacion';
import { TokenReenviarValidacion } from '../models/token-reenviar-validacion';
import { ConfimarcionClaveReinicio } from '../models/confimarcion-clave-reinicio';
import { Usuario } from '@interfaces/usuario/usuario';
import { Store } from '@ngrx/store';
import { usuarioActionInit } from '@redux/actions/usuario.actions';
import { configuracionVisualizarAction } from '@redux/actions/configuracion.actions';
export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  currentUser$: Observable<UserType>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private store: Store,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  login(email: string, password: string) {
    return this.http
      .post<Token>(
        `${environment.URL_API_MUUP}/seguridad/login/`,
        { username: email, password: password },
        { context: chackRequiereToken() }
      )
      .pipe(
        tap((respuesta: Token) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );
          this.tokenService.guardarToken(respuesta.token, calcularTresHoras);
          this.tokenService.guardarRefreshToken(
            respuesta['refresh-token'],
            calcularTresHoras
          );
        })
      );
  }

  logout() {
    localStorage.clear();
    localStorage.removeItem(this.authLocalStorageToken);
    this.tokenService.eliminarToken();
    this.tokenService.eliminarRefreshToken();
    removeCookie('usuario', { path: '/', domain: environment.dominioApp });
    removeCookie('usuario', { path: '/' });
    const empresaPatron = 'empresa-';
    document.cookie.split(';').forEach(function (cookie) {
      const cookieNombre = cookie.split('=')[0].trim();
      if (cookieNombre.startsWith(empresaPatron)) {
        removeCookie(cookieNombre);
      }
    });
    window.location.href = `${environment.dominioHttp}://${environment.dominioApp.slice(1)}/inicio`;
  }

  registration(data: any) {
    return this.http.post(
      `${environment.URL_API_MUUP}/seguridad/usuario/`,
      {
        username: data.usuario,
        password: data.clave,
      },
      {
        context: chackRequiereToken(),
      }
    );
  }

  recuperarClave(email: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/seguridad/usuario/cambio-clave-solicitar/`,
      { username: email, accion: 'clave' },
      { context: chackRequiereToken() }
    );
  }

  validacion(token: string) {
    return this.http.post<TokenVerificacion>(
      `${environment.URL_API_MUUP}/seguridad/usuario/verificar/`,
      { token },
      { context: chackRequiereToken() }
    );
  }

  reenviarValidacion(codigoUsuario: number) {
    return this.http.post<TokenReenviarValidacion>(
      `${environment.URL_API_MUUP}/seguridad/verificacion/`,
      { codigoUsuario },
      { context: chackRequiereToken() }
    );
  }

  refreshToken(refreshToken: string) {
    return this.http
      .post<Token>(`${environment.URL_API_MUUP}`, { refreshToken })
      .pipe(
        tap((respuesta: Token) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000
          );

          this.tokenService.guardarToken(respuesta.token, calcularTresHoras);
          this.tokenService.guardarRefreshToken(
            respuesta['refresh-token'],
            calcularTresHoras
          );
        })
      );
  }

  reiniciarClave(password: string, token: string) {
    return this.http.post<ConfimarcionClaveReinicio>(
      `${environment.URL_API_MUUP}/seguridad/usuario/cambio-clave-verificar/`,
      {  password, token },
      { context: chackRequiereToken() }
    );
  }

  cambiarClave(usuario_id: string, password: string) {
    return this.http.post<ConfimarcionClaveReinicio>(
      `${environment.URL_API_MUUP}/seguridad/usuario/cambio-clave/`,
      {  usuario_id, password },
      { context: chackRequiereToken() }
    );
  }


  confirmarInivitacion(token: string){
    return this.http.post(`${environment.URL_API_MUUP}/contenedor/usuariocontenedor/confirmar/`,{
      token
    })
  }

  loginExitoso(usuario: Usuario){
    this.store.dispatch(
      usuarioActionInit({
        usuario: {
          id: usuario.id,
          username: usuario.username,
          imagen: usuario.imagen,
          nombre_corto: usuario.nombre_corto,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          telefono: usuario.telefono,
          correo: usuario.correo,
          idioma: usuario.idioma,
          dominio: usuario.dominio,
          fecha_limite_pago: new Date(usuario.fecha_limite_pago),
          vr_saldo: usuario.vr_saldo,
        },
      })
    );
    if (window.location.host.includes(environment.dominioApp)) {
      this.store.dispatch(
        configuracionVisualizarAction({
          configuracion: {
            visualizarApps: true,
          },
        })
      );
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/contenedor/lista']);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
