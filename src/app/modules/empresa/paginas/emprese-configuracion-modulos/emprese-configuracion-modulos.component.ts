import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { AplicacionModulo } from '@comun/type/aplicacion-modulo.type';
import { ConfiguracionCarteraComponent } from '@modulos/cartera/paginas/configuracion/configuracion-cartera.component';
import { ConfiguracionCompraComponent } from '@modulos/compra/paginas/configuracion/configuracion-compra.component';
import { ConfiguracionContabilidadComponent } from '@modulos/contabilidad/paginas/configuracion/configuracion-contabilidad.component';
import { ConfiguracionGeneralComponent } from '@modulos/general/paginas/configuracion/configuracion-general.component';
import { ConfiguracionHumanoComponent } from '@modulos/humano/paginas/configuracion/configuracion-humano.component';
import { ConfiguracionInventarioComponent } from '@modulos/inventario/paginas/configuracion/configuracion-inventario.component';
import { ConfiguracionTesoreriaComponent } from '@modulos/tesoreria/paginas/configuracion/configuracion-tesoreria.component';
import { ConfiguracionTransporteComponent } from '@modulos/transporte/paginas/configuracion/configuracion-transporte.component';
import { ConfiguracionVentaComponent } from '@modulos/venta/paginas/configuracion/configuracion-venta.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { configuracionVisualizarBreadCrumbsAction } from '@redux/actions/configuracion.actions';
import { obtenerConfiguracionVisualizarApp } from '@redux/selectors/configuracion.selectors';
import { obtenerContenedorPlanId } from '@redux/selectors/contenedor.selectors';
import { obtenerMenuModulos } from '@redux/selectors/menu.selectors';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-emprese-configuracion-modulos',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TranslateModule,
    NgbNavModule,
    ConfiguracionGeneralComponent,
    ConfiguracionVentaComponent,
    ConfiguracionHumanoComponent,
    ConfiguracionTransporteComponent,
    ConfiguracionTesoreriaComponent,
    ConfiguracionInventarioComponent,
    ConfiguracionCompraComponent,
    ConfiguracionContabilidadComponent,
    ConfiguracionCarteraComponent
],
  templateUrl: './emprese-configuracion-modulos.component.html',
  styleUrl: './emprese-configuracion-modulos.component.scss',
})
export class EmpreseConfiguracionModulosComponent extends General implements OnInit, OnDestroy {

  arrMenuApps: AplicacionModulo[];
  visualizarMenuApps = false;
  menuSeleccionado: AplicacionModulo = 'general'

  ngOnInit() {
    this.store.dispatch(
      configuracionVisualizarBreadCrumbsAction({
        configuracion: {
          visualizarBreadCrumbs: false,
        },
      })
    );
    this.store
      .select(obtenerConfiguracionVisualizarApp)
      .pipe(
        tap((respuestaVisualizarApp) => {
          this.visualizarMenuApps = respuestaVisualizarApp;
        }),
        switchMap(() => this.store.select(obtenerContenedorPlanId)),
        switchMap((plan_id) => this.store.select(obtenerMenuModulos(plan_id))),
        tap((respuestaMenuModulos) => {
          this.arrMenuApps = respuestaMenuModulos;
        })
      )
      .subscribe();
  }

  seleccionarConfiguracion(modulo: AplicacionModulo){
   this.menuSeleccionado = modulo
   this.changeDetectorRef.detectChanges()
  }

  ngOnDestroy(): void {
    this.alertaService.cerrarMensajes()
    this.store.dispatch(
      configuracionVisualizarBreadCrumbsAction({
        configuracion: {
          visualizarBreadCrumbs: true,
        },
      })
    );
  }
}
