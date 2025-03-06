import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { General } from '@comun/clases/general';
import { Resolucion } from '@interfaces/general/resolucion.interface';
import { Concepto } from '@modulos/contenedor/interfaces/concepto.interface';
import { DocumentoTipo } from '@modulos/empresa/interfaces/documento-tipo.interface';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-conceptos-lista',
  templateUrl: './conceptos-lista.component.html',
  standalone: true,
  imports: [CommonModule, TranslateModule],
})
export class DocumentoDocumentoTipoComponent
  extends General
  implements OnInit, OnDestroy
{
  arrDocumentosTipos: DocumentoTipo[] = [];
  resolucionId: number;
  documentoTipoSeleccionado: any;
  public conceptosLista = signal<Concepto[]>([]);
  public conceptoSelecionado: Concepto | null = null;

  constructor(
    private empresaService: EmpresaService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    // this.consultarInformacion();
    this._getConceptos();
  }

  ngOnDestroy(): void {
    this.alertaService.cerrarMensajes();
  }

  // consultarInformacion() {
  //   this.empresaService.obtenerDocumentoTipo().subscribe((respuesta) => {
  //     this.arrDocumentosTipos = respuesta;
  //     this.changeDetectorRef.detectChanges();
  //   });
  // }

  private _getConceptos() {
    this.empresaService.obtenerConceptos().subscribe((respuesta) => {
      this.conceptosLista.set(respuesta);
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
    // this.consultarInformacion();
    this.changeDetectorRef.detectChanges();
    this.modalService.dismissAll();
    this.changeDetectorRef.detectChanges();
  }

  abrirModal(content: any, conceptoNomina: Concepto) {
    this.conceptoSelecionado = conceptoNomina;
    // this._generalService
    //   .consultarDatosAutoCompletar<RegistroAutocompletarHumConcepto>({
    //     modelo: 'HumConcepto',
    //     serializador: 'ListaAutocompletar',
    //   })
    //   .subscribe((respuesta) => {
    //     this.iniciarFormularioConcepto();
    //     this.formularioConcepto.patchValue({
    //       id: this.conceptoSelecionado.id,
    //       nombre: this.conceptoSelecionado.nombre,
    //     });
    //     this.arrConceptosHumano = respuesta.registros;

    //   });

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }
}
