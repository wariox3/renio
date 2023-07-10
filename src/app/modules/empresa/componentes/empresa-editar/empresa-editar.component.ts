import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AlertaService } from '@comun/services/alerta.service';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { withLatestFrom } from 'rxjs';

@Component({
  selector: 'app-empresa-editar',
  templateUrl: './empresa-editar.component.html',
  styleUrls: ['./empresa-editar.component.scss']
})
export class EmpresaEditarComponent implements OnInit {
  visualizarBtnAtras = false;
  codigoUsuario = '';
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

  ngOnInit(): void {
    this.store.select(obtenerId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
  }

  enviarFormulario(dataFormularioLogin: any){
    this.empresaService
    .editar(dataFormularioLogin, this.codigoUsuario, "5")
    .subscribe({
      next: () => {
        this.alertaService.mensajaExitoso('Nueva empresa creada', '');
        this.modalService.dismissAll()
        location.reload();
      },
    });
  }

  openModal() {
    this.modalRef = this.modalService.open(this.customTemplate, { backdrop: 'static' });
  }

}
