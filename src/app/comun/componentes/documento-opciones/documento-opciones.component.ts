import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TablaComponent } from '../tabla/tabla.component';
import { General } from '@comun/clases/general';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { documentos } from '@comun/extra/mapeo-entidades/documentos';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarConMovimiento } from '@interfaces/comunes/autocompletar/con/cont-movimiento.interface';

@Component({
  selector: 'app-comun-documento-opciones',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, TablaComponent],
  templateUrl: './documento-opciones.component.html',
  styleUrl: './documento-opciones.component.scss',
})
export class DocumentoOpcionesComponent extends General {
  private modalService = inject(NgbModal);
  private _generalService = inject(GeneralService);
  private descargarArchivosService = inject(DescargarArchivosService);
  arrDocumentos: any[];
  cantidad_registros: number;
  modelo: 'documento';

  constructor() {
    super();
  }

  abirModal(content: any) {
    this.activatedRoute.queryParams
      .subscribe((parametro) => {
        this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarConMovimiento>( {
          filtros: [
            {
              propiedad: 'documento_id',
              valor1: parametro.detalle,
            },
          ],
          modelo: 'ConMovimiento',
        })
        .subscribe((respuesta) => {
          this.arrDocumentos = respuesta.registros.map((documento) => ({
            id: documento.id,
            fecha: documento.fecha,
            numero: documento.numero,
            contacto_nombre_corto: documento.contacto_nombre_corto,
            comprobante: documento.comprobante_nombre,
            cuenta: documento.cuenta_codigo,
            grupo: documento.grupo_nombre,
            base: documento.base,
            debito: documento.debito,
            credito: documento.credito,
          }));
        });

        this.store.dispatch(
          ActualizarMapeo({ dataMapeo: documentos['ConMovimiento'] })
        );

        this.modalService.open(content, {
          ariaLabelledBy: 'modal-basic-title',
          size: 'lg',
        });
      })
      .unsubscribe();
  }

  descargarExcel() {
    this.activatedRoute.queryParams
      .subscribe((parametro) => {
        let modelo = parametro.itemTipo!;
        this.descargarArchivosService.descargarExcelAdminsitrador(modelo, {
          filtros: [
            {
              propiedad: 'documento_id',
              valor1: parametro.detalle,
            },
          ],
          modelo: 'ConMovimiento',
          excel: true,
          ...{
            limite: 5000,
          },
        });
      })
      .unsubscribe();
  }
}
