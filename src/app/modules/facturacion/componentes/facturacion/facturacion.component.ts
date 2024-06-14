import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Renderer2, type OnInit } from '@angular/core';
import { CardComponent } from "../../../../comun/componentes/card/card.component";
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { Factura, Consumo } from '../../../../interfaces/facturacion/Facturacion';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { BehaviorSubject, zip } from 'rxjs';
import { FacturacionService } from '@modulos/facturacion/servicios/facturacion.service';
import { environment } from '@env/environment';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { FechasService } from '@comun/services/fechas.service';
import { HistorialFacturacionComponent } from '../historial-facturacion/historial-facturacion.component';

@Component({
    selector: 'app-facturacion',
    standalone: true,
    templateUrl: './facturacion.component.html',
    styleUrls: ['./facturacion.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        CardComponent,
        NgbNavModule,
        TranslateModule,
        HistorialFacturacionComponent
    ]
})
export class FacturacionComponent extends General implements OnInit {

  constructor(
    private facturacionService: FacturacionService,
    public fechaServices: FechasService,
    private renderer: Renderer2,
    private contenedorServices: ContenedorService,
  ) {
    super();
  }

  facturas: Factura[] = [];
  consumos: Consumo[] = [];
  active: 1;
  consumoTotal = 0
  codigoUsuario = '';
  arrFacturasSeleccionados: any[] = [];
  totalPagar = new BehaviorSubject(0);


  ngOnInit() {
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
    this.consultarInformacion();

   }

   consultarInformacion() {
    const hoy = new Date();
    const fechaHasta = hoy.toISOString().slice(0, 10);
    zip(
      this.facturacionService.facturacion(this.codigoUsuario),
      this.facturacionService.facturacionFechas(this.codigoUsuario, fechaHasta)
    ).subscribe((respuesta) => {
      this.facturas = respuesta[0].movimientos;
      this.consumos = respuesta[1].consumos;
      respuesta[1].consumos.map((consumo: Consumo) => {
        this.consumoTotal += consumo.vr_total;
      });
      this.changeDetectorRef.detectChanges();
    });
  }

  agregarRegistrosPagar(item: Factura) {
    const index = this.arrFacturasSeleccionados.findIndex(
      (documento) => documento.id === item.id
    );
    let valorActualPagar = this.totalPagar.getValue();

    if (index !== -1) {
      this.totalPagar.next(
        valorActualPagar - parseInt(item.vr_saldo_enmascarado)
      );
      this.arrFacturasSeleccionados.splice(index, 1);
      this.changeDetectorRef.detectChanges();
    } else {
      this.totalPagar.next(
        valorActualPagar + parseInt(item.vr_saldo_enmascarado)
      );
      this.arrFacturasSeleccionados.push(item);
      this.changeDetectorRef.detectChanges();
    }

    let referencia = '';
    referencia = this.arrFacturasSeleccionados
      .map((factura: Factura, index: number, array: Factura[]) => {
        if (index === array.length - 1) {
          return factura.id;
        } else {
          return factura.id + '-';
        }
      })
      .join('');

    if (referencia !== '') {
      this.contenedorServices
        .contenedorGenerarIntegridad({
          referencia,
          monto: `${this.totalPagar.getValue()}`,
        })
        .subscribe((respuesta) => {
          this.habitarBtnWompi(respuesta.hash, referencia);
        });
    }
  }

  habitarBtnWompi(hash: string, referencia: string) {
    let url = 'http://localhost:4200/estado'
    if (environment.production) {
      url = `${environment.dominioHttp}://${environment.dominioApp.slice(1)}/estado`
    }

    this.totalPagar.subscribe((total) => {
      const wompiWidget = document.getElementById('wompiWidget');
      if (total > 0) {
        const script = this.renderer.createElement('script');
        this.renderer.setAttribute(
          script,
          'src',
          'https://checkout.wompi.co/widget.js'
        );
        this.renderer.setAttribute(script, 'data-render', 'button');
        this.renderer.setAttribute(
          script,
          'data-public-key',
          'pub_test_HrxfoMdxFQFlRQ5be2n0jplrqpAViOKb'
        );
        this.renderer.setAttribute(script, 'data-currency', 'COP');
        this.renderer.setAttribute(
          script,
          'data-amount-in-cents',
          total.toString()
        );
        this.renderer.setAttribute(script, 'data-redirect-url', url)
        this.renderer.setAttribute(script, 'data-reference', referencia);
        this.renderer.setAttribute(script, 'data-signature:integrity', hash);
        while (wompiWidget?.firstChild) {
          wompiWidget!.removeChild(wompiWidget!.firstChild);
        }
        this.renderer.appendChild(wompiWidget, script);
      } else {
        while (wompiWidget?.firstChild) {
          wompiWidget!.removeChild(wompiWidget!.firstChild);
        }
      }
    });
  }

}
