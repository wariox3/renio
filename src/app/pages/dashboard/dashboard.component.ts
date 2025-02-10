import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Empresa } from '@interfaces/contenedor/empresa.interface';
import { InicioCarteraComponent } from '@modulos/cartera/paginas/inicio/inicio-cartera/inicio-cartera.component';
import { InicioCompraComponent } from '@modulos/compra/paginas/inicio/inicio-compra/inicio-compra.component';
import { InicioContabilidadComponent } from '@modulos/contabilidad/paginas/inicio/inicio-contabilida.component';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  empresaActionInit,
  empresaActualizacionAsisteneElectronico,
  empresaActualizacionAsistenePredeterminado,
} from '@redux/actions/empresa.actions';
import { obtenerMenuSeleccion } from '@redux/selectors/menu.selectors';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EMPTY, switchMap, tap } from 'rxjs';
import { InicioTesoreriaComponent } from '@modulos/tesoreria/paginas/inicio/inicio-tesoreria/inicio-tesoreria.component';
import { InicioTransporteComponent } from '@modulos/transporte/paginas/inicio/inicio-transporte/inicio-transporte.component';
import { InicioVentaComponent } from '@modulos/venta/paginas/inicio/inicio-venta/inicio-venta.component';
import { InicioInventarioComponent } from '@modulos/inventario/paginas/inicio/inicio-inventario/inicio-inventario.component';
import { InicioHumanoComponent } from '@modulos/humano/paginas/inicio/inicio-humano/inicio-humano.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { InicioGeneralComponent } from '@modulos/general/paginas/inicio/inicio-general/inicio-general.component';
import { FakeLoadFullScreenComponent } from '../../comun/componentes/fake-load-full-screen/fake-load-full-screen.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    RouterModule,
    NgbTooltipModule,
    NgApexchartsModule,
    CommonModule,
    InicioContabilidadComponent,
    InicioCompraComponent,
    InicioVentaComponent,
    InicioTesoreriaComponent,
    InicioInventarioComponent,
    InicioHumanoComponent,
    InicioCarteraComponent,
    InicioGeneralComponent,
    InicioTransporteComponent,
    FakeLoadFullScreenComponent,
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'd-block' },
})
export class DashboardComponent extends General implements OnInit {
  ruta = 'general';
  asistente_electronico: boolean;
  asistente_predeterminado: boolean;
  visualizarFakeLoad = signal(false);

  constructor(
    private httpService: HttpService,
    private empresaService: EmpresaService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.store
      .select(obtenerMenuSeleccion)
      .pipe(
        tap((nombreSeleccion) => {
          this.ruta = nombreSeleccion;
        })
      )
      .subscribe();
  }

  consultarInformacion() {
    this.httpService
      .getDetalle<Empresa>(`general/empresa/1/`)
      .subscribe((empresa) => {
        this.asistente_electronico = empresa.asistente_electronico;
        this.asistente_predeterminado = empresa.asistente_predeterminado;

        this.store.dispatch(empresaActionInit({ empresa }));
        this.changeDetectorRef.detectChanges();
      });
  }

  finalizarProceso() {
    this.empresaService.finalizarProceso().subscribe((respuesta) => {
      this.store.dispatch(
        empresaActualizacionAsisteneElectronico({
          asistente_electronico: respuesta.asistente_termiando,
        })
      );
      this.consultarInformacion();
    });
  }

  finalizarProcesoPredeterminado() {
    this.empresaService
      .finalizarProcesoPredeterminado()
      .subscribe((respuesta) => {
        this.store.dispatch(
          empresaActualizacionAsistenePredeterminado({
            asistente_predeterminado: respuesta.asistente_termiando,
          })
        );
        this.consultarInformacion();
      });
  }

  configuracionRapida() {
    this.alertaService
      .confimarConfigracionPrederminada()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            this.visualizarFakeLoad.update(() => true);
            return this.empresaService.configuracionPredeterminada();
          }
          return EMPTY;
        }),
        tap((respuesta: any) => {
          if (respuesta) {
            this.visualizarFakeLoad.update(() => false);
            this.consultarInformacion();
            this.alertaService.mensajaExitoso(respuesta.mensaje);
          }
        })
      )
      .subscribe();
  }
}
