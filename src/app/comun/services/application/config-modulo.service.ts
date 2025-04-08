import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { COMPRA_CONFIGURACION } from '@modulos/compra/domain/constantes/configuracion.constant';
import { BehaviorSubject, filter } from 'rxjs';
import { UrlService } from '../infrastructure/url.service';
import {
  FuncionalidadConfig,
  ModeloConfig,
  ModuloConfig,
} from '@interfaces/menu/configuracion.interface';
import { TESORERIA_CONFIGURACION } from '@modulos/tesoreria/domain/constantes/configuracion.constant';
import { CARTERA_CONFIGURACION } from '@modulos/cartera/domain/constantes/configuracion.constant';
import { INVENTARIO_CONFIGURACION } from '@modulos/inventario/domain/constantes/configuracion.constant';
import { VENTA_CONFIGURACION } from '@modulos/venta/domain/constantes/configuracion.constant';
import { CONTABILIDAD_CONFIGURACION } from '@modulos/contabilidad/domain/constantes/configuracion.constant';
import { GENERAL_CONFIGURACION } from '@modulos/general/domain/constantes/configuracion.constant';
import { HUMANO_CONFIGURACION } from '@modulos/humano/domain/constantes/configuracion.constant';

@Injectable({
  providedIn: 'root',
})
export class ConfigModuleService {
  private _router = inject(Router);
  private _activatedRoute = inject(ActivatedRoute);
  private _urlService = inject(UrlService);
  private _currentConfig = new BehaviorSubject<ModuloConfig | null>(null);
  private _currentModelConfig = new BehaviorSubject<ModeloConfig | null>(null);

  public currentConfig$ = this._currentConfig.asObservable();
  public currentModelConfig$ = this._currentModelConfig.asObservable();
  public modulo = signal<string | null>(null);
  public funcionalidad = signal<string | null>(null);

  constructor() {
    this.setupRouterListener();
    this.loadConfigForCurrentRoute();
  }

  public getModeloConfig(modelo: string) {
    const funcionalidadConfig = this.findFuncionalidadConfig(
      this.funcionalidad(),
    );
    const modeloConfig = this.findModeloConfig(funcionalidadConfig, modelo);

    return modeloConfig;
  }

  public findFuncionalidadConfig(nombreFuncionalidad: string | null) {
    const modulo = this._currentConfig.value?.funcionalidades?.find(
      (modulo) => modulo.nombreFuncionalidad === nombreFuncionalidad,
    );

    return modulo;
  }

  public findModeloConfig(
    funcionalidadConfig: FuncionalidadConfig | undefined,
    modelo: string,
  ) {
    return funcionalidadConfig?.modelos?.find((modulo) => modulo.key == modelo);
  }

  private setupRouterListener(): void {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadConfigForCurrentRoute();
      });
  }

  private loadConfigForCurrentRoute(): void {
    const url = this._router.url;
    const queryParams = this._activatedRoute.snapshot.queryParams;

    const modulo = this._urlService.obtenerModuloPath(url);
    const funcionalidad = this._urlService.obtenerFuncionalidadPath(url);
    const modelo = queryParams['modelo'];

    this.setModuleConfig(modulo, funcionalidad);

    if (modelo) {
      this._setModeloConfig(modelo);
    }
  }

  private _setModeloConfig(modelo: string) {
    const funcionalidadConfig = this.findFuncionalidadConfig(
      this.funcionalidad(),
    );
    const modeloConfig = this.findModeloConfig(funcionalidadConfig, modelo);

    if (modeloConfig) {
      this._currentModelConfig.next(modeloConfig);
    } else {
      this._currentModelConfig.next(null);
    }
  }

  private setModuleConfig(
    modulo: string | null,
    funcionalidad: string | null,
  ): void {
    this.modulo.set(modulo);
    this.funcionalidad.set(funcionalidad);

    switch (modulo) {
      case 'general':
        this._currentConfig.next(GENERAL_CONFIGURACION);
        break;
      case 'compra':
        this._currentConfig.next(COMPRA_CONFIGURACION);
        break;
      case 'tesoreria':
        this._currentConfig.next(TESORERIA_CONFIGURACION);
        break;
      case 'cartera':
        this._currentConfig.next(CARTERA_CONFIGURACION);
        break;
      case 'inventario':
        this._currentConfig.next(INVENTARIO_CONFIGURACION);
        break;
      case 'contabilidad':
        this._currentConfig.next(CONTABILIDAD_CONFIGURACION);
        break;
      case 'venta':
        this._currentConfig.next(VENTA_CONFIGURACION);
        break;
      case 'humano':
        this._currentConfig.next(HUMANO_CONFIGURACION);
        break;
      default:
        this._currentConfig.next(null);
    }
  }

  get modelo() {
    return this._currentModelConfig.value?.ajustes.parametrosHttpConfig?.modelo;
  }

  get key() {
    return this._currentModelConfig.value?.key;
  }

  get modeloConfig() {
    return this._currentModelConfig.value;
  }
}
