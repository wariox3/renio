import { Injectable, inject } from '@angular/core';
import { cookieKey } from '@comun/services/domain/enums/cookie-key.enum';
import { CookieService } from '@comun/services/infrastructure/cookie.service';
import { BehaviorSubject } from 'rxjs';

/**
 * Interfaz para la configuración de cookies requeridas
 */
export interface RequiredCookieConfig {
  key: string;
  redirectOnMissing?: boolean;
  errorMessage?: string;
}

/**
 * Servicio para gestionar la verificación de cookies requeridas
 * Permite configurar dinámicamente qué cookies son necesarias para el funcionamiento de la app
 */
@Injectable({
  providedIn: 'root'
})
export class CookieGuardService {
  private _cookieService = inject(CookieService);
  
  // Lista de cookies requeridas por defecto
  private _requiredCookies: RequiredCookieConfig[] = [
    { key: cookieKey.ACCESS_TOKEN, redirectOnMissing: true, errorMessage: 'Token de acceso no encontrado' },
    { key: cookieKey.USUARIO, redirectOnMissing: true, errorMessage: 'Información de usuario no encontrada' }
  ];
  
  // Subject para notificar cambios en el estado de las cookies
  private _cookieStatusSubject = new BehaviorSubject<boolean>(false);
  public cookieStatus$ = this._cookieStatusSubject.asObservable();

  constructor() {
    // Verificar cookies al iniciar el servicio
    this.verificarCookiesRequeridas();
  }

  /**
   * Verifica si todas las cookies requeridas existen
   * @returns true si todas las cookies requeridas existen, false en caso contrario
   */
  verificarCookiesRequeridas(): boolean {
    const todasExisten = this._requiredCookies
      .filter(cookie => cookie.redirectOnMissing !== false)
      .every(cookie => this._cookieService.has(cookie.key));
    
    this._cookieStatusSubject.next(todasExisten);
    return todasExisten;
  }

  /**
   * Obtiene las cookies faltantes
   * @returns Array con las configuraciones de cookies faltantes
   */
  obtenerCookiesFaltantes(): RequiredCookieConfig[] {
    return this._requiredCookies
      .filter(cookie => !this._cookieService.has(cookie.key));
  }

  /**
   * Agrega una cookie a la lista de cookies requeridas
   * @param cookieConfig Configuración de la cookie a agregar
   */
  agregarCookieRequerida(cookieConfig: RequiredCookieConfig): void {
    // Verificar si ya existe la cookie en la lista
    const existeIndex = this._requiredCookies.findIndex(c => c.key === cookieConfig.key);
    
    if (existeIndex >= 0) {
      // Actualizar configuración si ya existe
      this._requiredCookies[existeIndex] = {
        ...this._requiredCookies[existeIndex],
        ...cookieConfig
      };
    } else {
      // Agregar nueva configuración
      this._requiredCookies.push(cookieConfig);
    }
    
    // Verificar cookies después de actualizar la lista
    this.verificarCookiesRequeridas();
  }

  /**
   * Elimina una cookie de la lista de cookies requeridas
   * @param cookieKey Clave de la cookie a eliminar
   */
  eliminarCookieRequerida(cookieKey: string): void {
    this._requiredCookies = this._requiredCookies.filter(c => c.key !== cookieKey);
    
    // Verificar cookies después de actualizar la lista
    this.verificarCookiesRequeridas();
  }

  /**
   * Establece la lista completa de cookies requeridas
   * @param cookieConfigs Lista de configuraciones de cookies requeridas
   */
  establecerCookiesRequeridas(cookieConfigs: RequiredCookieConfig[]): void {
    this._requiredCookies = cookieConfigs;
    
    // Verificar cookies después de actualizar la lista
    this.verificarCookiesRequeridas();
  }

  /**
   * Obtiene la lista actual de cookies requeridas
   * @returns Lista de configuraciones de cookies requeridas
   */
  obtenerCookiesRequeridas(): RequiredCookieConfig[] {
    return [...this._requiredCookies];
  }
}
