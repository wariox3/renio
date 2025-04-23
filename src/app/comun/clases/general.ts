import { ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertaService } from '@comun/services/alerta.service';
import { AplicacionModulo } from '@comun/type/aplicacion-modulo.type';
import { AplicacionPrefijoModulo } from '@comun/type/aplicacion-prefijo-modulo.type';
import { AplicacionAccion } from '@comun/type/aplicaciones-acciones.type';
import { AplicacionUbicaciones } from '@comun/type/aplicaciones-ubicaciones.type';
import { informacionMenuItem } from '@interfaces/menu/menu';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

export class General {
  protected router = inject(Router);
  protected activatedRoute = inject(ActivatedRoute);
  protected store = inject(Store);
  protected alertaService = inject(AlertaService);
  protected translateService = inject(TranslateService);
  protected changeDetectorRef = inject(ChangeDetectorRef);
  // protected modulo = '';
  // protected modelo = '';
  protected tipo = '';
  protected formulario = '';
  protected accion: AplicacionAccion = null;
  protected detalle: number = 0;
  protected parametrosUrl: Partial<informacionMenuItem['data']>;
  protected ubicacion: AplicacionUbicaciones;
  protected moduloAplicacion: Record<
    AplicacionPrefijoModulo,
    AplicacionModulo
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

      const detalleId = this.activatedRoute.snapshot.paramMap.get('id');

      if (detalleId) {
        this.detalle = Number(detalleId);
      } else {
        this.detalle = 0
      }

      // TODO: Fumarse esto
      switch (true) {
        case this.router.url.includes('documento'):
          this.ubicacion = 'documento';
          break;
        case this.router.url.includes('administrador'):
          this.ubicacion = 'administrador';
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

      // TODO: buscar la manera de fumarse esto
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
    });
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
