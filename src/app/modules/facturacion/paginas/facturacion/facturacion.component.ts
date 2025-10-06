import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  Renderer2,
  signal,
  type OnInit,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { FechasService } from '@comun/services/fechas.service';
import { environment } from '@env/environment';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { FacturacionService } from '@modulos/facturacion/servicios/facturacion.service';
import {
  NgbActiveModal,
  NgbDropdownModule,
  NgbModal,
  NgbModalModule,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { configuracionVisualizarBreadCrumbsAction } from '@redux/actions/configuracion.actions';
import {
  obtenerUsuarioId,
  obtenerUsuarioVrAbono,
  obtenerUsuarioVrcredito,
  obtenerUsuarioVrSaldo,
} from '@redux/selectors/usuario.selectors';
import { BehaviorSubject, Subject, Subscription, takeUntil, zip } from 'rxjs';
import { CardComponent } from '@comun/componentes/card/card.component';
import { Consumo, Factura } from '@interfaces/facturacion/Facturacion';
import { HistorialFacturacionComponent } from '../historial-facturacion/historial-facturacion.component';
import { InformacionFacturacionComponent } from '../informacion-facturacion/informacion-facturacion.component';
import { CountUpModule } from 'ngx-countup';
import { ContactarAsesorComponent } from '../../../../comun/componentes/contactar-asesor/contactar-asesor.component';
import { AplicarCreditoComponent } from '../../../../comun/componentes/aplicar-credito/aplicar-credito.component';
import {
  usuarioActionActualizarVrAbono,
  usuarioActionActualizarVrCredito,
  usuarioActionActualizarVrSaldo,
} from '@redux/actions/usuario.actions';
import { RouterLink } from '@angular/router';
import { VerConsumoUsuarioComponent } from '../../components/ver-consumo-usuario/ver-consumo-usuario.component';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CardComponent,
    NgbNavModule,
    TranslateModule,
    HistorialFacturacionComponent,
    NgbDropdownModule,
    InformacionFacturacionComponent,
    NgbModalModule,
    NgbTooltipModule,
    CountUpModule,
    ContactarAsesorComponent,
    AplicarCreditoComponent,
    RouterLink,
    VerConsumoUsuarioComponent,
  ],
  providers: [NgbActiveModal],
})
export class FacturacionComponent extends General implements OnInit, OnDestroy {
  constructor(
    private facturacionService: FacturacionService,
    public fechaServices: FechasService,
    private renderer: Renderer2,
    private contenedorServices: ContenedorService,
  ) {
    super();
  }

  public registrosSeleccionados = signal<number[]>([]);
  facturas: Factura[] = [];
  consumos: Consumo[] = [];
  active: number = 1;
  consumoTotal = 0;
  codigoUsuario = 0;
  arrFacturasSeleccionados: any[] = [];
  arrFacturacionInformacion: any[] = [];
  vrCredito = signal(0);
  vrSaldo = signal(0);
  vrAbonos = signal(0);
  movimientoId = signal(0);
  totalPagar = new BehaviorSubject(0);
  existeInformacionFacturacion = signal(false);
  informacionFacturacion: number | null = null;
  vrBalance = computed(() => this.vrCredito() - this.vrSaldo());
  private readonly _modalService = inject(NgbModal);
  private _unsubscribe$ = new Subject<void>();
  movimientoSeleccionado = signal<any>({});

  private wompiSubscription: Subscription | null = null;
  private wompiHash: string = '';
  private wompiReferencia: string = '';

  ngOnInit() {
    this.store
      .select(obtenerUsuarioVrcredito)
      .subscribe((credito) => this.vrCredito.set(credito));
    this.store
      .select(obtenerUsuarioVrSaldo)
      .subscribe((saldo) => this.vrSaldo.set(saldo));

    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
    this.store.select(obtenerUsuarioVrAbono).subscribe((abono) => {
      this.vrAbonos.set(abono);
    });
    this.store.dispatch(
      configuracionVisualizarBreadCrumbsAction({
        configuracion: {
          visualizarBreadCrumbs: false,
        },
      }),
    );
    this.actualizarSaldo();

    // Consultar informacion de facturacion
    this.consultarInformacion();
  }

  private actualizarSaldo() {
    this.facturacionService
      .obtenerUsuarioVrSaldo(this.codigoUsuario)
      .subscribe((respuesta) => {
        this.vrSaldo.set(respuesta.saldo);
        this.vrCredito.set(respuesta.credito);
        this.vrAbonos.set(respuesta.abono);

        this.store.dispatch(
          usuarioActionActualizarVrAbono({
            vr_abono: respuesta.abono,
          }),
        );
      });
  }

  consultarInformacion() {
    const hoy = new Date();
    const fechaHasta = hoy.toISOString().slice(0, 10);
    zip(
      this.facturacionService.facturacion(this.codigoUsuario),
      this.facturacionService.facturacionFechas(this.codigoUsuario, fechaHasta),
      this.facturacionService.informacionFacturacion(this.codigoUsuario),
    ).subscribe((respuesta) => {
      this.facturas = respuesta[0].movimientos;
      this.consumos = respuesta[1].consumos;
      this.consumoTotal = respuesta[1].total_consumo;
      
      this.procesarInformacionFacturacion(respuesta[2].informaciones_facturacion);


      if (this.existeInformacionFacturacion()) {
        this.agregarRegistrosPagarFactura(this.facturas);
      }

      this.changeDetectorRef.detectChanges();
    });
  }

  private agregarRegistrosPagarFactura(facturas: Factura[]) {
    facturas.forEach((factura) => {
      this.agregarRegistrosPagar(factura);
    });
  }

  private procesarInformacionFacturacion(informacionFacturacion: any[]) {
    this.arrFacturacionInformacion = informacionFacturacion;
    
    if (this.arrFacturacionInformacion.length > 0) {
      this.informacionFacturacion = this.arrFacturacionInformacion[0].id;
      this.facturacionService.setInformacionFacturacionId(this.informacionFacturacion);
      this.existeInformacionFacturacion.set(true);
    } else {
      this.informacionFacturacion = null;
      this.existeInformacionFacturacion.set(false);
    }
  }

  public idEstaEnLista(id: number): boolean {
    return this.registrosSeleccionados().indexOf(id) !== -1;
  }

  public agregarIdARegistrosSeleccionados(id: number) {
    this.registrosSeleccionados().push(id);
  }

  public removerIdRegistrosSeleccionados(id: number) {
    const itemsFiltrados = this.registrosSeleccionados().filter(
      (item) => item !== id,
    );
    this.registrosSeleccionados.set(itemsFiltrados);
  }

  private mostrarErrorInformacionFacturacion() {
    this.alertaService.mensajeError(
      'Error',
      'Debe seleccionar la información de facturación antes de realizar el pago',
    );
  }

  agregarRegistrosPagar(item: Factura) {
    if (this.informacionFacturacion === null || '') {
      this.mostrarErrorInformacionFacturacion();
      return;
    }

    const index = this.arrFacturasSeleccionados.findIndex(
      (documento) => documento.id === item.id,
    );
    let valorActualPagar = this.totalPagar.getValue();
    const vrSaldo = `${item.vr_saldo}00`;

    if (index !== -1) {
      this.totalPagar.next(valorActualPagar - parseInt(vrSaldo));
      this.arrFacturasSeleccionados.splice(index, 1);
      this.removerIdRegistrosSeleccionados(item.id);
      this.changeDetectorRef.detectChanges();
    } else {
      this.totalPagar.next(valorActualPagar + parseInt(vrSaldo));
      this.arrFacturasSeleccionados.push(item);
      this.agregarIdARegistrosSeleccionados(item.id);
      this.changeDetectorRef.detectChanges();
    }

    // Solo actualizar la referencia y solicitar el hash si hay facturas seleccionadas
    if (this.arrFacturasSeleccionados.length > 0) {
      let referencia = this.arrFacturasSeleccionados
        .map((factura: Factura, index: number, array: Factura[]) => {
          if (index === array.length - 1) {
            return `P${factura.id}-${this.informacionFacturacion}`;
          } else {
            return `P${factura.id}-${this.informacionFacturacion}_`;
          }
        })
        .join('');


      this.contenedorServices
        .contenedorGenerarIntegridad({
          referencia,
          monto: `${this.totalPagar.getValue()}`,
        })
        .subscribe((respuesta) => {
          this.wompiHash = respuesta.hash;
          this.wompiReferencia = referencia;
          this.actualizarBotonWompi();
        });
    } else {
      // Si no hay facturas seleccionadas, limpiar el botón
      this.limpiarBotonWompi();
    }
  }

  private limpiarBotonWompi() {
    this.wompiHash = '';
    this.wompiReferencia = '';
    this.actualizarBotonWompi();
  }

  // Método separado para actualizar el botón de Wompi
  actualizarBotonWompi() {
    const wompiWidget = document.getElementById('wompiWidget');
    if (!wompiWidget) {
      console.error('Elemento wompiWidget no encontrado');
      return;
    }

    // Limpiar el contenedor
    wompiWidget.innerHTML = '';

    const total = this.totalPagar.getValue();

    // Solo crear el botón si hay un monto a pagar y tenemos hash y referencia
    if (total > 0 && this.wompiHash && this.wompiReferencia) {
      // Obtener la URL de redirección según el entorno
      const url = environment.production
        ? `${environment.dominioHttp}://app${environment.dominioApp}/estado`
        : 'http://localhost:4200/estado';

      const script = this.renderer.createElement('script');

      // Configurar atributos
      const attributes = {
        src: 'https://checkout.wompi.co/widget.js',
        'data-render': 'button',
        'data-public-key': environment.llavePublica,
        'data-currency': 'COP',
        'data-amount-in-cents': total.toString(),
        'data-redirect-url': url,
        'data-reference': this.wompiReferencia,
        'data-signature:integrity': this.wompiHash,
      };

      // Aplicar atributos al script
      Object.entries(attributes).forEach(([key, value]) => {
        this.renderer.setAttribute(script, key, value);
      });

      // Añadir el script al contenedor
      this.renderer.appendChild(wompiWidget, script);
    }
  }

  consultarDetalle() {
    this.facturacionService
      .informacionFacturacion(this.codigoUsuario)
      .subscribe((respuesta) => {
        this.arrFacturacionInformacion = respuesta.informaciones_facturacion;
        if (this.arrFacturacionInformacion.length > 0) {
          this.informacionFacturacion = this.arrFacturacionInformacion[0].id;
          // Set the ID in the service to share with other components using the Observable
          this.facturacionService.setInformacionFacturacionId(this.informacionFacturacion);
        }
        this.changeDetectorRef.detectChanges();
      });
  }

  getIdentificacionPrefix(id: number): string {
    switch (id) {
      case 1:
        return 'RC';
      case 2:
        return 'TI';
      case 3:
        return 'CC';
      case 4:
        return 'TE';
      case 5:
        return 'CE';
      case 6:
        return 'NI';
      case 7:
        return 'PB';
      case 8:
        return 'TE';
      case 9:
        return 'RC';
      default:
        return 'NI';
    }
  }

  confirmarEliminarFacturacion(informacion_id: any) {
    this.alertaService
      .confirmar({
        titulo: '¿Estas seguro?',
        texto: 'Esta operación no se puede revertir',
        textoBotonCofirmacion: 'Confirmar',
      })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          this.eliminarInformacionFacturacion(informacion_id);
        }
      });
  }

  eliminarInformacionFacturacion(informacion_id: any) {
    this.limpiarBotonWompi();
    this.facturacionService
      .eliminarInformacionFacturacion(informacion_id)
      .subscribe((respuesta) => {
        if (respuesta) {
          this.alertaService.mensajaExitoso(
            'Se ha eliminado correctamente la información de facturación',
          );
        }
        
        this.facturacionService
          .informacionFacturacion(this.codigoUsuario)
          .subscribe((respuesta) => {
            this.procesarInformacionFacturacion(respuesta.informaciones_facturacion);
            this.limpiarInformacionFacturacion();
            if (this.existeInformacionFacturacion()) {
              this.agregarRegistrosPagarFactura(this.facturas);
            }
            this.changeDetectorRef.detectChanges();
          });
      });
  }

  ngOnDestroy(): void {
    this.alertaService.cerrarMensajes();
    this.store.dispatch(
      configuracionVisualizarBreadCrumbsAction({
        configuracion: {
          visualizarBreadCrumbs: true,
        },
      }),
    );

    // Cancelar la suscripción de Wompi
    if (this.wompiSubscription) {
      this.wompiSubscription.unsubscribe();
      this.wompiSubscription = null;
    }

    // Completar el subject de unsubscribe
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  abrirModalContactarAsesor(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
    });
  }

  abrirModalAplicarCredito(item: any, content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
    });
    this.movimientoId.set(item.id);
  }

  actualizarPago() {
    this.facturacionService
      .obtenerUsuarioVrSaldo(this.codigoUsuario)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((respuesta) => {
        this.store.dispatch(
          usuarioActionActualizarVrSaldo({
            vr_saldo: respuesta.saldo,
          }),
        );
        this.store.dispatch(
          usuarioActionActualizarVrCredito({
            vr_credito: respuesta.credito,
          }),
        );
        this.changeDetectorRef.detectChanges();
      });
  }

  actualizarInformarcion() {
    this.actualizarPago();
    this.consultarInformacion();
    this.arrFacturasSeleccionados = [];
    this.registrosSeleccionados.set([]);
    this.totalPagar.next(0);
    this.wompiHash = '';
    this.wompiReferencia = '';
    this.actualizarBotonWompi();
    this.changeDetectorRef.detectChanges();
  }

  limpiarInformacionFacturacion() {
    this.arrFacturasSeleccionados = [];
    this.registrosSeleccionados.set([]);
    this.totalPagar.next(0);
  }

  irRealizarPago() {
    if (this.informacionFacturacion === null || '') {
      this.mostrarErrorInformacionFacturacion();
      return;
    }
    this.router.navigate(['/facturacion/realizar-pago']);
  }

  abrirModalVerConsumo(content: any, movimiento: any) {
    this.movimientoSeleccionado.set(movimiento);
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
    });
  }
}
