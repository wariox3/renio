import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { InquilinoFormulario } from '@interfaces/usuario/inquilino';
import { InquilinoService } from '@modulos/inquilino/servicios/inquilino.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-inquilino-editar',
  templateUrl: './inquilino-editar.component.html',
  styleUrls: ['./inquilino-editar.component.scss'],
})
export class InquilinoEditarComponent extends General {
  visualizarBtnAtras = false;
  informacionInquilino: InquilinoFormulario = {
    nombre: '',
    subdominio: '',
    plan_id: 0,
    imagen: null,
  };
  @Input() inquilino_id!: string;
  @Output() emitirActualizacion: EventEmitter<any> = new EventEmitter();
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private inquilinoService: InquilinoService
  ) {
    super();
  }

  enviarFormulario(dataFormularioLogin: InquilinoFormulario) {
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((codigoUsuario) => {
          return this.inquilinoService.editar(
            dataFormularioLogin,
            codigoUsuario,
            this.inquilino_id
          );
        }),
        tap((respuestaActualizacion: any) => {
          if (respuestaActualizacion.actualizacion) {
            this.modalService.dismissAll();
            this.alertaService.mensajaExitoso(
              this.translateService.instant(
                'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
              )
            );
            return this.emitirActualizacion.emit(true);
          }
        })
      )
      .subscribe();
  }

  openModal() {
    this.inquilinoService
      .consultarInformacion(this.inquilino_id)
      .pipe(
        tap((respuesta) => {
          this.informacionInquilino = respuesta;
          this.modalRef = this.modalService.open(this.customTemplate, {
            backdrop: 'static',
            size: 'lg',
            keyboard: false,
          });
        })
      )
      .subscribe();
  }
}
