import { Resolucion } from '@interfaces/general/resolucion.interface';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { General } from '@comun/clases/general';
import { DocumentoTipo } from '@modulos/empresa/interfaces/documento-tipo.interface';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import ResolucionFormularioComponent from '@modulos/general/componentes/resolucion/resolucion-formulario/resolucion-formulario.component';
import { CardComponent } from "../../../../comun/componentes/card/card.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-empresa-resolucion',
    standalone: true,
    templateUrl: './empresa-resolucion.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ResolucionFormularioComponent, CardComponent, TranslateModule]
})
export class EmpresaResolucionComponent extends General implements OnInit {
  documentoTipo: DocumentoTipo = {
    id: 0,
    nombre: '',
    consecutivo: 0,
    resolucion_id: undefined,
    resolucion_numero: '',
    resolucion_prefijo: '',
    venta: false,
    compra: false,
  };
  @Output() emitirRegistroGuardado: EventEmitter<any> = new EventEmitter();


  constructor(private empresaService: EmpresaService) {
    super();
  }

  ngOnInit(): void {
    this.empresaService
      .consultarDocumentoTipoUno()
      .subscribe((respuestaDocumentoTipo) => {
        this.documentoTipo = respuestaDocumentoTipo;
        this.changeDetectorRef.detectChanges();
      });
  }

  gestionResolucion(resolucion: Resolucion) {
    if (resolucion.id) {
      this.empresaService
        .asignarResolucionDocumentoTipo(resolucion.id)
        .subscribe(() => this.emitirRegistro());
    }
  }


  emitirRegistro(){
    return this.emitirRegistroGuardado.emit(true);
  }
}
