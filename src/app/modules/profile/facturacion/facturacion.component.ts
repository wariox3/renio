import { Contenedor } from './../../../interfaces/usuario/contenedor';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { Factura, ResumenService, Consumo } from '../services/resumen.service';
import { BehaviorSubject, Observable, of, zip } from 'rxjs';
import { FechasService } from '@comun/services/fechas.service';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss'],
})
export class FacturacionComponent extends General implements OnInit {
  codigoUsuario = '';
  facturas: Factura[] = [];
  consumos: Consumo[] = [];
  consumoTotal = 0;
  test = 1;
  arrFacturasSeleccionados: any[] = [];
  totalPagar = new BehaviorSubject(0); // Inicia con el valor 0

  constructor(
    private resumenService: ResumenService,
    public fechaServices: FechasService,
    private contenedorServices: ContenedorService,
    private renderer: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
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
      this.resumenService.facturacion(this.codigoUsuario),
      this.resumenService.facturacionFechas(this.codigoUsuario, fechaHasta)
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
