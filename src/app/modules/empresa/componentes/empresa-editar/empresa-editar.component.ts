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
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-empresa-editar',
  templateUrl: './empresa-editar.component.html',
  styleUrls: ['./empresa-editar.component.scss'],
})
export class EmpresaEditarComponent extends General {
  visualizarBtnAtras = false;
  informacionInquilino: InquilinoFormulario = {
    nombre: '',
    subdominio: '',
    plan_id: 0,
    imagen: null,
  };
  @Input() empresa_id!: string;
  @Output() emitirActualizacion: EventEmitter<any> = new EventEmitter();
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private empresaService: EmpresaService
  ) {
    super();
  }

  enviarFormulario(dataFormularioLogin: InquilinoFormulario) {
    this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((codigoUsuario) => {
          return this.empresaService.editar(
            dataFormularioLogin,
            codigoUsuario,
            this.empresa_id
          );
        }),
        tap((respuestaActualizacion: any)=>{
          if(respuestaActualizacion.actualizacion){
            this.modalService.dismissAll();
            this.alertaService.mensajaExitoso(
              this.translateService.instant(
                'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
              )
            );
            return this.emitirActualizacion.emit(true)
          }
        }),
      )
      .subscribe();
  }

  openModal() {
    this.empresaService
      .consultarInformacion(this.empresa_id)
      .pipe(
        tap((respuesta) => {
          this.informacionInquilino = respuesta;
          this.modalRef = this.modalService.open(this.customTemplate, {
            backdrop: 'static',
            size: 'lg',
            keyboard: false
          });
        })
      )
      .subscribe();
  }
}
