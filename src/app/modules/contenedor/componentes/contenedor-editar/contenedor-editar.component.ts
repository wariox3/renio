import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { ContenedorFormulario } from '@interfaces/usuario/contenedor';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-contenedor-editar',
  templateUrl: './contenedor-editar.component.html',
})
export class ContenedorEditarComponent extends General {
  visualizarBtnAtras = false;
  informacionContenedor: ContenedorFormulario = {
    nombre: '',
    subdominio: '',
    plan_id: 0,
    imagen: null,
  };
  @Input() contenedor_id!: string;
  @Output() emitirActualizacion: EventEmitter<any> = new EventEmitter();
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private contenedorService: ContenedorService
  ) {
    super();
  }

  enviarFormulario(dataFormularioLogin: ContenedorFormulario) {
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((codigoUsuario) => {
          return this.contenedorService.editar(
            dataFormularioLogin,
            codigoUsuario,
            this.contenedor_id
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
    this.contenedorService
      .consultarInformacion(this.contenedor_id)
      .pipe(
        tap((respuesta) => {
          this.informacionContenedor = respuesta;
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
