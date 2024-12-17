import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ConfiguracionCarteraComponent } from '@modulos/cartera/componentes/configuracion/configuracion-cartera.component';
import { ConfiguracionCompraComponent } from '@modulos/compra/componentes/configuracion/configuracion-compra.component';
import { ConfiguracionContabilidadComponent } from '@modulos/contabilidad/componentes/configuracion/configuracion-contabilidad.component';
import { ConfiguracionGeneralComponent } from '@modulos/general/componentes/configuracion/configuracion-general.component';
import { ConfiguracionHumanoComponent } from '@modulos/humano/componentes/configuracion/configuracion-humano.component';
import { ConfiguracionInventarioComponent } from '@modulos/inventario/componentes/configuracion/configuracion-inventario.component';
import { ConfiguracionTesoreriaComponent } from '@modulos/tesoreria/componentes/configuracion/configuracion-tesoreria.component';
import { ConfiguracionTransporteComponent } from '@modulos/transporte/componentes/configuracion/configuracion-transporte.component';
import { ConfiguracionVentaComponent } from '@modulos/venta/componentes/configuracion/configuracion-venta.component';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
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

  arrMenuApps: string[];
  visualizarMenuApps = false;
  menuSeleccionado = 'GENERAL'

  ngOnInit() {
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

  seleccionarConfiguracion(modulo: string){
   this.menuSeleccionado = modulo.toUpperCase()
   this.changeDetectorRef.detectChanges()
  }

  ngOnDestroy(): void {
    this.alertaService.cerrarMensajes()
  }
}
