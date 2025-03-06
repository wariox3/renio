import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { Resolucion } from '@interfaces/general/resolucion.interface';
import { DocumentoTipo } from '@modulos/empresa/interfaces/documento-tipo.interface';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { EmpresaDocumentoTipoEditarComponent } from '../empresa-documento-tipo-editar/empresa-documento-tipo-editar.component';

@Component({
  selector: 'app-empresa-documento-tipo',
  templateUrl: './empresa-documento-tipo.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    EmpresaDocumentoTipoEditarComponent,
    SiNoPipe
  ],
})
export class DocumentoDocumentoTipoComponent
  extends General
  implements OnInit, OnDestroy
{
  arrDocumentosTipos: DocumentoTipo[] = [];
  resolucionId: number;
  documentoTipoSeleccionado: any;

  constructor(
    private empresaService: EmpresaService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
  }

  ngOnDestroy(): void {
    this.alertaService.cerrarMensajes();
  }

  consultarInformacion() {
    this.empresaService.obtenerDocumentoTipo().subscribe((respuesta) => {
      this.arrDocumentosTipos = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

  navegarEditar(documentoTipo: any, content: any) {
    this.documentoTipoSeleccionado = documentoTipo;
    this.resolucionId = documentoTipo.id;
    this.changeDetectorRef.detectChanges();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  cerrarModal(resolucion: Resolucion): void {
    this.consultarInformacion();
    this.changeDetectorRef.detectChanges();
    this.modalService.dismissAll();
    this.changeDetectorRef.detectChanges();
  }
}
