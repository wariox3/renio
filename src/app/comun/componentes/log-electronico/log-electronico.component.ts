import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeysPipe } from '@pipe/keys.pipe';

@Component({
  selector: 'app-log-electronico',
  standalone: true,
  imports: [CommonModule, TranslateModule, KeysPipe, NgbDropdownModule],
  templateUrl: './log-electronico.component.html',
  styleUrl: './log-electronico.component.scss',
})
export class LogElectronicoComponent extends General {
  arrCorreos: any = [];
  arrEventos: any = [];
  arrValidaciones: any = [];
  @Input() estadoElectronicoNotificado = false;
  @Input() estadoAnulado = false;
  @Output() emitirRenotificar: EventEmitter<Boolean> = new EventEmitter();

  constructor(
    private httpService: HttpService,
    private modalService: NgbModal
  ) {
    super();
  }

  verLog(content: any) {
    this.httpService
      .post('general/documento/electronico_log/', {
        documento_id: this.detalle,
      })
      .subscribe((respuesta: any) => {
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
      });

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
    this.changeDetectorRef.detectChanges();
  }

  reNotifica() {
    this.httpService
      .post('general/documento/renotificar/', { documento_id: this.detalle })
      .subscribe((respuesta: any) => {
        this.alertaService.mensajaExitoso('Documento re notificado');
        this.emitirRenotificar.emit(true)
      });
  }

  verEventosDian(content: any){
    this.httpService
    .post('general/documento/evento-dian/', {
      id: this.detalle,
    }).subscribe((respuesta: any)=> {
      this.arrEventos = respuesta.eventos
      this.changeDetectorRef.detectChanges()
    });
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }
}
