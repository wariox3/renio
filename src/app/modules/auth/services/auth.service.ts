import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Token } from "@interfaces/usuario/token"
import { TokenService } from './token.service';
import { chackRequiereToken } from '@interceptores/token.interceptor';
import { removeCookie } from 'typescript-cookie';
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
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  // public methods
  login(email: string, password: string) {
    return this.http
      .post<Token>(
        `${environment.URL_API_MUUP}/seguridad/login/`,
        { username: email, password: password },
        { context: chackRequiereToken() }
      )
      .pipe(
        tap((respuesta: Token) => {
          let calcularTresHoras = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);
          this.tokenService.guardarToken(respuesta.token, calcularTresHoras);
          this.tokenService.guardarRefreshToken(respuesta['refresh-token'], calcularTresHoras);
        })
      );

    // this.isLoadingSubject.next(true);
    // return this.authHttpService.login(email, password).pipe(
    //   map((auth: AuthModel) => {
    //     const result = this.setAuthFromLocalStorage(auth);
    //     return result;
    //   }),
    //   switchMap(() => this.getUserByToken()),
    //   catchError((err) => {
    //     console.error('err', err);
    //     return of(undefined);
    //   }),
    //   finalize(() => this.isLoadingSubject.next(false))
    // );
  }

  logout() {
    localStorage.clear();
    localStorage.removeItem(this.authLocalStorageToken);
    // localStorage.removeItem('ruta');
    // localStorage.removeItem('usuario');
    this.tokenService.eliminarToken();
    this.tokenService.eliminarRefreshToken();
    removeCookie('empresa',  {path: '/', domain:  '.muup.online' })
    removeCookie('usuario',  {path: '/', domain:  '.muup.online' })
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  registration(data: any) {
    return this.http.post(
      `${environment.URL_API_MUUP}/seguridad/usuario/`,
      {
        username: data.username,
        password: data.clave,
      },
      {
        context: chackRequiereToken(),
      }
    );

    // this.isLoadingSubject.next(true);
    // return this.authHttpService.createUser(user).pipe(
    //   map(() => {
    //     this.isLoadingSubject.next(false);
    //   }),
    //   switchMap(() => this.login(user.email, user.password)),
    //   catchError((err) => {
    //     console.error('err', err);
    //     return of(undefined);
    //   }),
    //   finalize(() => this.isLoadingSubject.next(false))
    // );
  }

  recuperarClave(email: string) {
    return this.http.post(
      `${environment.URL_API_MUUP}/seguridad/verificacion/nuevo/`,
      { username: email, accion: 'clave' },
      { context: chackRequiereToken() }
    );
    // this.isLoadingSubject.next(true);
    // return this.authHttpService
    //   .forgotPassword(email)
    //   .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.authToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  refreshToken(refreshToken: string){
    return this.http.post<Token>(
      `${environment.URL_API_MUUP}`,
      {refreshToken}
    ).pipe(
      tap((respuesta: Token) => {
        let calcularTresHoras = new Date(new Date().getTime() + 3 * 60 * 60 * 1000);

        this.tokenService.guardarToken(respuesta.token, calcularTresHoras);
        this.tokenService.guardarRefreshToken(respuesta['refresh-token'], calcularTresHoras);
      })
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
