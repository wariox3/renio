import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { TranslateModule } from '@ngx-translate/core';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { KeysPipe } from '@pipe/keys.pipe';
import { FacturaService } from '@modulos/venta/servicios/factura.service';

@Component({
  selector: 'app-log-electronico',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    KeysPipe,
    NgbDropdownModule,
    NgbNavModule,
  ],
  templateUrl: './log-electronico.component.html',
  styleUrl: './log-electronico.component.scss',
})
export class LogElectronicoComponent extends General implements OnInit {
  private _facturaService = inject(FacturaService);

  arrCorreos: any = [];
  arrEventos: any = [];
  arrValidaciones: any = [];
  arrEventosDian: any = [];
  active = 0;
  public informacion = signal<any>(null);
  
  // Signals para estados de carga
  public loadingNotificaciones = signal<boolean>(false);
  public loadingEventos = signal<boolean>(false);

  @Input() estadoElectronicoNotificado = false;
  @Input() estadoElectronicoEnviado = false;
  @Input() estadoAnulado = false;
  @Output() emitirRenotificar: EventEmitter<Boolean> = new EventEmitter();

  constructor(
    private httpService: HttpService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  consultarInformacion() {
    this._facturaService.consultarDetalle(this.detalle).subscribe((respuesta: any) => {
      this.informacion.set(respuesta.documento);
    });
  }

  reNotifica() {
    this.httpService
      .post('general/documento/renotificar/', { documento_id: this.detalle })
      .subscribe((respuesta: any) => {
        this.alertaService.mensajaExitoso('Documento re notificado');
        this.emitirRenotificar.emit(true);
      });
  }

  verInformacion(content: any) {
    this.consultarInformacion();
    
    // Resetear arrays al abrir modal
    this.arrCorreos = [];
    this.arrEventos = [];
    this.arrValidaciones = [];
    this.arrEventosDian = [];
    
    // Resetear estados de carga
    this.loadingNotificaciones.set(false);
    this.loadingEventos.set(false);

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  cargarNotificaciones() {
    this.loadingNotificaciones.set(true);
    
    this.httpService
      .post('general/documento/electronico_log/', {
        documento_id: this.detalle,
      })
      .subscribe({
        next: (respuesta: any) => {
          const { correos, eventos, validaciones } = respuesta.log;
          this.arrCorreos = correos.map((correo: any) => ({
            codigoCorreoPk: correo.codigoCorreoPk,
            enviado: correo.fecha,
            numeroDocumento: correo.numeroDocumento,
            fecha: correo.fecha,
            correo: correo.correo,
            correoCopia: correo.copia,
          }));
          this.arrEventos = eventos.map((evento: any) => ({
            codigoEventoPk: evento.codigoEventoPk,
            evento: evento.evento,
            correo: evento.correo,
            fecha: evento.fecha,
            ipEnvio: evento.ipEnvio,
            idmensaje: evento.idMensaje,
          }));
          this.arrValidaciones = validaciones;
          this.loadingNotificaciones.set(false);
          this.changeDetectorRef.detectChanges();
        },
        error: () => {
          this.loadingNotificaciones.set(false);
        }
      });
  }

  cargarEventosDian() {
    this.loadingEventos.set(true);
    
    this.httpService
      .post('general/documento/evento-dian/', {
        id: this.detalle,
      })
      .subscribe({
        next: (respuesta: any) => {
          this.arrEventosDian = respuesta.eventos;
          this.loadingEventos.set(false);
          this.changeDetectorRef.detectChanges();
        },
        error: () => {
          this.loadingEventos.set(false);
        }
      });
  }

  onTabChange(tabId: number) {
    this.active = tabId;
    
    if (tabId === 1) {
      this.cargarNotificaciones();
    } else if (tabId === 2) {
      this.cargarEventosDian();
    }
  }
}
