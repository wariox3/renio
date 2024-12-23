import {
  Component,
  OnInit
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Empresa } from '@interfaces/contenedor/empresa.interface';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  empresaActionInit,
  empresaActualizacionAsisteneElectronico,
} from '@redux/actions/empresa.actions';
import {
  NgApexchartsModule
} from 'ng-apexcharts';
import { CardComponent } from '../../comun/componentes/card/card.component';
import { LaboratorioComponent } from '../../comun/componentes/laboratorio/laboratorio.component';
import { InicioHumanoComponent } from './../../modules/humano/componentes/inicio/inicio-humano/inicio-humano.component';
import { CommonModule } from '@angular/common';
import { InicioCarteraComponent } from '@modulos/cartera/componentes/inicio/inicio-cartera/inicio-cartera.component';
import { InicioCompraComponent } from '@modulos/compra/componentes/inicio/inicio-compra/inicio-compra.component';
import { InicioContabilidadComponent } from '@modulos/contabilidad/componentes/inicio/inicio-contabilida.component';
import { InicioGeneralComponent } from '@modulos/general/componentes/inicio/inicio-general/inicio-general.component';
import { InicioInventarioComponent } from '@modulos/inventario/componentes/inicio/inicio-inventario/inicio-inventario.component';
import { InicioTesoreriaComponent } from '@modulos/tesoreria/componentes/inicio/inicio-tesoreria/inicio-tesoreria.component';
import { InicioTransporteComponent } from '@modulos/transporte/componentes/inicio/inicio-transporte/inicio-transporte.component';
import { InicioVentaComponent } from '@modulos/venta/componentes/inicio/inicio-venta/inicio-venta.component';
import { dashboardService } from './dashboard.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    RouterModule,
    NgbTooltipModule,
    LaboratorioComponent,
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
    InicioTransporteComponent
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'd-block' },
})
export class DashboardComponent extends General implements OnInit {

  ruta = localStorage.getItem('ruta')!;
  asistente_electronico: boolean;

  constructor(
    private httpService: HttpService,
    private empresaService: EmpresaService,
    private dashboardService: dashboardService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this.httpService
      .getDetalle<Empresa>(`general/empresa/1/`)
      .subscribe((empresa) => {
        this.asistente_electronico = empresa.asistente_electronico;
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

}
