import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subdominio } from '@comun/clases/subdomino';
import { noRequiereToken } from '@interceptores/token.interceptor';
import { Usuario } from '@interfaces/usuario/usuario';
import { Token } from '@modulos/auth/interfaces/token.interface';
import { Store } from '@ngrx/store';
import {
  configuracionVisualizarAppsAction,
  configuracionVisualizarBreadCrumbsAction,
} from '@redux/actions/configuracion.actions';
import { asignarDocumentacion } from '@redux/actions/documentacion.actions';
import { usuarioActionInit } from '@redux/actions/usuario.actions';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { removeCookie } from 'typescript-cookie';
import { ConfirmarInivitacion } from '../interfaces/confirmar-inivitacion.interface';
import { ConsultarEstadoVerificado } from '../interfaces/consultar-estado-verificado';
import { RecuperarClaveVerificacion } from '../interfaces/recuperacion-clave-verificacion.interface';
import { TokenReenviarValidacion } from '../interfaces/token-reenviar-validacion.interface';
import { TokenVerificacion } from '../interfaces/token-verificacion.interface';
import { ConfimarcionClaveReinicio } from '../models/confimarcion-clave-reinicio';
import { UserModel } from '../models/user.model';
import { TokenService } from './token.service';
export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService extends Subdominio implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  private http = inject(HttpClient);
  private router = inject(Router);
  private tokenService = inject(TokenService);
  private store = inject(Store);

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

  constructor() {
    super();
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  login(email: string, password: string) {
    return this.http
      .post<Token>(
        `${this.URL_API_BASE}/seguridad/login/`,
        { username: email, password: password },
        { context: noRequiereToken() },
      )
      .pipe(
        tap((respuesta: Token) => {
          let calcularTresHoras = new Date(
            new Date().getTime() + 3 * 60 * 60 * 1000,
          );
          this.tokenService.guardarToken(respuesta.token, calcularTresHoras);
          this.tokenService.guardarRefreshToken(
            respuesta['refresh-token'],
            calcularTresHoras,
          );
        }),
      );
  }

  logout() {
    localStorage.clear();
    localStorage.removeItem(this.authLocalStorageToken);
    this.tokenService.eliminarToken();
    this.tokenService.eliminarRefreshToken();
    this.store.dispatch(asignarDocumentacion({ id: 0, nombre: '' }));
    removeCookie('usuario', { path: '/', domain: environment.dominioApp });
    removeCookie('usuario', { path: '/' });
    const patrones = ['empresa-', 'contenedor-', 'configuracion'];
    document.cookie.split(';').forEach(function (cookie) {
      const cookieNombre = cookie.split('=')[0].trim();
      patrones.forEach(function (patron) {
        if (cookieNombre.startsWith(patron)) {
          removeCookie(cookieNombre);
          removeCookie(cookieNombre, {
            path: '/',
            domain: environment.dominioApp,
          });
        }
      });
    });
    if (environment.production) {
      window.location.href = `${
        environment.dominioHttp
      }://${environment.dominioApp.slice(1)}/inicio`;
    } else {
      this.router.navigate(['/inicio']);
    }
  }

  registration(data: any) {
    return this.http.post<Usuario>(
      `${this.URL_API_BASE}/seguridad/usuario/`,
      {
        username: data.usuario,
        password: data.clave,
      },
      {
        context: noRequiereToken(),
      },
    );
  }

  recuperarClave(email: string) {
    return this.http.post<RecuperarClaveVerificacion>(
      `${this.URL_API_BASE}/seguridad/usuario/cambio-clave-solicitar/`,
      { username: email, accion: 'clave' },
      { context: noRequiereToken() },
    );
  }

  validacion(token: string) {
    return this.http.post<TokenVerificacion>(
      `${this.URL_API_BASE}/seguridad/usuario/verificar/`,
      { token },
      { context: noRequiereToken() },
    );
  }

  reenviarValidacion(codigoUsuario: number) {
    return this.http.post<TokenReenviarValidacion>(
      `${this.URL_API_BASE}/seguridad/verificacion/`,
      { codigoUsuario },
      { context: noRequiereToken() },
    );
  }

  refreshToken(refreshToken: string) {
    return this.http.post<Token>(`${this.URL_API_BASE}`, { refreshToken }).pipe(
      tap((respuesta: Token) => {
        let calcularTresHoras = new Date(
          new Date().getTime() + 3 * 60 * 60 * 1000,
        );

        this.tokenService.guardarToken(respuesta.token, calcularTresHoras);
        this.tokenService.guardarRefreshToken(
          respuesta['refresh-token'],
          calcularTresHoras,
        );
      }),
    );
  }

  reiniciarClave(password: string, token: string) {
    return this.http.post<ConfimarcionClaveReinicio>(
      `${this.URL_API_BASE}/seguridad/usuario/cambio-clave-verificar/`,
      { password, token },
      { context: noRequiereToken() },
    );
  }

  cambiarClave(usuario_id: number, password: string) {
    return this.http.post<ConfimarcionClaveReinicio>(
      `${this.URL_API_BASE}/seguridad/usuario/cambio-clave/`,
      { usuario_id, password },
      { context: noRequiereToken() },
    );
  }

  confirmarInivitacion(token: string) {
    return this.http.post<ConfirmarInivitacion>(
      `${this.URL_API_BASE}/contenedor/usuariocontenedor/confirmar/`,
      {
        token,
      },
    );
  }

  loginExitoso(usuario: Usuario) {
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
          fecha_creacion: new Date(usuario.fecha_creacion),
          verificado: usuario.verificado,
          es_socio: usuario.es_socio,
          socio_id: usuario.socio_id,
          is_active: usuario.is_active,
          numero_identificacion: usuario.numero_identificacion,
          cargo: usuario.cargo,
        },
      }),
    );
    if (window.location.host.includes(environment.dominioApp)) {
      this.store.dispatch(
        configuracionVisualizarAppsAction({
          configuracion: {
            visualizarApps: true,
          },
        }),
      );
      this.store.dispatch(
        configuracionVisualizarBreadCrumbsAction({
          configuracion: {
            visualizarBreadCrumbs: true,
          },
        }),
      );
      this.router.navigate(['/dashboard']);
    } else {
      location.href = `${
        environment.dominioHttp
      }://${environment.dominioApp.slice(1)}/contenedor/lista`;
    }
  }

  consultarEstadoVerificado(usuario_id: string) {
    return this.http.post<ConsultarEstadoVerificado>(
      `${this.URL_API_BASE}/seguridad/usuario/estado-verificado/`,
      {
        usuario_id,
      },
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  listaSocio(socio_id: string) {
    return this.http.post(
      `${this.URL_API_BASE}/seguridad/usuario/lista-socio/`,
      {
        socio_id,
      },
    );
  }
}
