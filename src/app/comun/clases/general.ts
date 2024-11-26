import { ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaService } from '@comun/services/alerta.service';
import {
  ModuloAplicacion,
  prefijoModuloAplicacion,
} from '@interfaces/mapeo/mapeo';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

export class General {
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected store = inject(Store);
  protected alertaService = inject(AlertaService);
  protected translateService = inject(TranslateService);
  protected changeDetectorRef = inject(ChangeDetectorRef);
  protected modulo = '';
  protected modelo = '';
  protected tipo = '';
  protected formulario = '';
  protected accion: 'nuevo' | 'detalle' | 'editar' | null = null;
  protected detalle = 0;
  protected parametrosUrl: any = {};
  protected ubicacion:
    | 'documento'
    | 'administrador'
    | 'utilidad'
    | 'informe'
    | 'independiente';
  protected moduloAplicacion: Record<
    prefijoModuloAplicacion,
    ModuloAplicacion
  > = {
    com: 'compra',
    ven: 'venta',
    con: 'contabilidad',
    car: 'cartera',
    hum: 'humano',
    inv: 'inventario',
    gen: 'general',
    trans: 'transporte',
  };


  constructor() {
    this.consultarParametros();
  }

  consultarParametros() {
    this.activatedRoute.queryParams.subscribe((parametros) => {
      this.parametrosUrl = parametros;
      if (parametros.itemNombre) {
        this.modelo = parametros.itemNombre;
      }
      this.detalle = parametros.detalle;
      this.changeDetectorRef.detectChanges;
    });
    this.changeDetectorRef.detectChanges;

    switch (true) {
      case this.router.url.includes('documento'):
        this.ubicacion = 'documento';
        break;
      case this.router.url.includes('administrador'):
        this.ubicacion = 'administrador';
        // Obtener el prefijo a partir del modelo
        const prefijo: prefijoModuloAplicacion =  this.modelo.toLowerCase().substring(0, 3) as prefijoModuloAplicacion;

        // Verificar si el prefijo existe en las claves de moduloAplicacion
        const posicion = Object.keys(this.moduloAplicacion).indexOf(prefijo);

        if (posicion !== -1) {
          // Si el prefijo es válido, mostrar la posición
          this.modulo = this.moduloAplicacion[prefijo];
        }
        break;
      case this.router.url.includes('utilidad'):
        this.ubicacion = 'utilidad';
        break;
      case this.router.url.includes('informe'):
        this.ubicacion = 'informe';
        break;
      default:
        this.ubicacion = 'independiente';
        break;
    }

    switch (true) {
      case this.router.url.includes('/nuevo'):
        this.accion = 'nuevo';
        break;
      case this.router.url.includes('/detalle'):
        this.accion = 'detalle';
        break;
      case this.router.url.includes('/editar'):
        this.accion = 'editar';
        break;
    }
  }

  navegarDocumentoNuevo() {
    let parametrosParaRemover: string[] = ['detalle'];

    this.activatedRoute.queryParams.subscribe((parametros) => {
      let parametrosActuales = { ...parametros };

      // Eliminar los parámetros especificados en `parametrosParaRemover`
      parametrosParaRemover.forEach((param: any) => {
        if (parametrosActuales[param]) {
          delete parametrosActuales[param];
        }
      });

      this.router.navigate([`/documento/nuevo`], {
        queryParams: { ...parametrosActuales },
      });
    });
  }
}
