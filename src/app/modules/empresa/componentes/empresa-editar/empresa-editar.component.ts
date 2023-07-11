import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { AlertaService } from '@comun/services/alerta.service';
import { Empresa } from '@interfaces/usuario/empresa';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { of, tap } from 'rxjs';

@Component({
  selector: 'app-empresa-editar',
  templateUrl: './empresa-editar.component.html',
  styleUrls: ['./empresa-editar.component.scss'],
})
export class EmpresaEditarComponent {
  visualizarBtnAtras = false;
  codigoUsuario = '';
  informacionEmpresa = {
    nombre: null,
    subdominio: '',
  };
  @Input() empresa_id!: Number;
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;

  constructor(
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private empresaService: EmpresaService,
    private store: Store,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  enviarFormulario(dataFormularioLogin: any) {
    this.empresaService
      .editar(dataFormularioLogin, this.codigoUsuario, this.empresa_id)
      .pipe(
        tap(() => {
          this.modalService.dismissAll();
        })
      )
      .subscribe(() => {
        this.alertaService.mensajaExitoso('Empresa actualizada', 'Por favor espere, procesando actualización');
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
          this.modalRef = this.modalService.open(this.customTemplate, { backdrop: 'static' });
        })
      )
      .subscribe();
  }
}
