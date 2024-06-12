import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { General } from '@comun/clases/general';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { Factura, ResumenService, Consumo } from '../services/resumen.service';
import { zip } from 'rxjs';
import { FechasService } from '@comun/services/fechas.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss'],
})
export class FacturacionComponent extends General implements OnInit, AfterViewInit {
  codigoUsuario = '';
  facturas: Factura[] = [];
  consumos: Consumo[] = [];
  consumoTotal = 0;
  constructor(
    private resumenService: ResumenService,
    public fechaServices: FechasService,
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

  ngAfterViewInit(): void {
    this.insertScript();
  }

  public insertScript(): void {
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
    this.renderer.setAttribute(script, 'data-amount-in-cents', '100');
    this.renderer.setAttribute(script, 'data-reference', '4XMPGKWWPKWQ');
    this.renderer.setAttribute(
      script,
      'data-signature:integrity',
      'test_integrity_ziIaff4k5fcDpZBdahGkKZXl1J08v7wd'
    );
    const form = document.getElementById('wompiWidget');
    this.renderer.appendChild(form, script);
  }

  // insertScript(): void {
  //   const script = document.createElement('script');
  //   script.src = 'https://checkout.wompi.co/widget.js';
  //   script.setAttribute('data-render', 'button');
  //   script.setAttribute('data-public-key', 'pub_test_HrxfoMdxFQFlRQ5be2n0jplrqpAViOKb');
  //   script.setAttribute('data-currency', 'COP');
  //   script.setAttribute('data-amount-in-cents', '100');
  //   script.setAttribute('data-reference', '4XMPGKWWPKWQ');
  //   script.setAttribute('data-signature:integrity', 'test_integrity_ziIaff4k5fcDpZBdahGkKZXl1J08v7wd');

  //   const buttons = document.querySelectorAll('.btn-wompiWidget');
  //   buttons.forEach(button => {
  //     button.appendChild(script.cloneNode(true));
  //   });
  // }

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

}
