import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { DocumentoTipo } from '@interfaces/empresa/documentoTipo';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Resolucion } from '@interfaces/general/resolucion';
import { EmpresaDocumentoTipoEditarComponent } from '../empresa-documento-tipo-editar/empresa-documento-tipo-editar.component';

@Component({
  selector: 'app-empresa-documento-tipo',
  templateUrl: './empresa-documento-tipo.component.html',
  styleUrls: ['./empresa-documento-tipo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CardComponent,
    EmpresaDocumentoTipoEditarComponent
  ],
})
export class DocumentoDocumentoTipoComponent extends General implements OnInit {

  arrDocumentosTipos: DocumentoTipo[] = []
  resolucionId: number

  constructor(
    private empresaService: EmpresaService,
    private modalService: NgbModal
  ) {
    super()
  }

  ngOnInit() {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this.empresaService
      .obtenerDocumentoTipo()
      .subscribe((respuesta) => {
        this.arrDocumentosTipos = respuesta
        this.changeDetectorRef.detectChanges()
      });
  }

  navegarEditar(id: number, content: any){
    this.resolucionId = id
    this.changeDetectorRef.detectChanges()
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  cerrarModal(resolucion: Resolucion): void {
    this.consultarInformacion()
    this.changeDetectorRef.detectChanges();
    this.modalService.dismissAll();
    this.changeDetectorRef.detectChanges();
  }
}
