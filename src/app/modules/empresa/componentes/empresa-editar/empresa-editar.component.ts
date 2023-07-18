import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { EmpresaFormulario } from '@interfaces/usuario/empresa';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, tap } from 'rxjs';

@Component({
  selector: 'app-empresa-editar',
  templateUrl: './empresa-editar.component.html',
  styleUrls: ['./empresa-editar.component.scss'],
})
export class EmpresaEditarComponent extends General {
  visualizarBtnAtras = false;
  codigoUsuario = '';
  informacionEmpresa: EmpresaFormulario = {
    nombre: '',
    subdominio: '',
    plan_id: 0
  };
  @Input() empresa_id!: Number;
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private empresaService: EmpresaService,
  ) {
    super()
  }

  enviarFormulario(dataFormularioLogin: EmpresaFormulario) {
    this.empresaService
      .editar(dataFormularioLogin, this.codigoUsuario, this.empresa_id)
      .pipe(
        tap(() => {
          this.modalService.dismissAll();
        })
      )
      .subscribe(() => {
        this.alertaService.mensajaExitoso(
          this.translateService.instant("FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION")
        );
        setTimeout(()=> {
          location.reload()
        }, 5001)
      });
  }

  openModal() {
    this.empresaService
      .consultarInformacion(this.empresa_id)
      .pipe(
        tap((respuesta: any) => {
          this.informacionEmpresa = respuesta;
          this.modalRef = this.modalService.open(this.customTemplate, { backdrop: 'static', size: 'lg' });
        })
      )
      .subscribe();
  }
}
