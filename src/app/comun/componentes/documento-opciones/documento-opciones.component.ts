import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TablaComponent } from '../tabla/tabla.component';
import { General } from '@comun/clases/general';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { documentos } from '@comun/extra/mapeo-entidades/documentos';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';

@Component({
  selector: 'app-comun-documento-opciones',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, TablaComponent],
  templateUrl: './documento-opciones.component.html',
  styleUrl: './documento-opciones.component.scss',
})
export class DocumentoOpcionesComponent extends General {
  private modalService = inject(NgbModal);
  private httpService = inject(HttpService);
  private descargarArchivosService = inject(DescargarArchivosService)
  arrDocumentos: any[];
  cantidad_registros: number;
  modelo: 'documento';

  constructor() {
    super();
  }

  abirModal(content: any) {
    this.activatedRoute.queryParams
      .subscribe((parametro) => {
        this.httpService
          .post<{ cantidad_registros: number; registros: any[] }>(
            'general/funcionalidad/lista/',
            {
              filtros: [
                {
                  propiedad: 'documento_id',
                  valor1: parametro.detalle,
                },
              ],
              modelo: 'ConMovimiento',
              //serializador: 'General',
            }
          )
          .subscribe((respuesta) => {
            this.arrDocumentos = respuesta.registros.map((documento: any) => ({
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
