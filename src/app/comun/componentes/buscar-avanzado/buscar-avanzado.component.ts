import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import {
  NgbDatepickerModule,
  NgbModal,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KeysPipe } from '@pipe/keys.pipe';
import { BaseFiltroComponent } from '../base-filtro/base-filtro.component';
import { FiltroComponent } from '../ui/tabla/filtro/filtro.component';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';

@Component({
  selector: 'app-comun-buscar-avanzado',
  standalone: true,
  imports: [
    CommonModule,
    NgbDatepickerModule,
    KeysPipe,
    BaseFiltroComponent,
    TranslateModule,
    NgbTooltipModule,
    FiltroComponent,
  ],
  templateUrl: './buscar-avanzado.component.html',
  styleUrls: ['./buscar-avanzado.component.scss'],
})
export class BuscarAvanzadoComponent extends General {
  private _generalService = inject(GeneralService);
  private _filterTransformerService = inject(FilterTransformerService);
  public closeResult = '';
  public arrPropiedades: any;
  public ordenadoTabla: string = '';
  public arrItems: any[];
  public filtros = {};
  @Input() consultarUrl = '';
  @Input() tituloModal = '';
  @Input() consultarModelo = ''; //BORRAR
  @Input() campoLista: any[] = [];
  @Input() campoFiltros: string[] = [];
  @Input() filtrosPermanentes: any = {};
  @Input() consultarTipo: 'Administrador' | 'Documento'; //borrar
  @Output() emitirRegistroSeleccionado: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NgbModal) {
    super();
  }

  abirModal(content: any) {
    this._reiniciarFiltros();
    this.consultarLista();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  obtenerFiltros(arrfiltros: any) {
    this.filtros =
      this._filterTransformerService.transformToApiParams(arrfiltros);
    this.consultarLista();
  }

  consultarLista() {
    this._generalService
      .consultaApi(this.consultarUrl, {
        ...this.filtros,
        ...this.filtrosPermanentes,
      })
      .subscribe((respuesta: any) => {
        // Mapea cada registro en respuesta.registros para crear un nuevo array this.arrItems
        this.arrItems = respuesta.results.map((registro: any) => {
          // Inicializa un objeto vacío para almacenar los valores de los campos especificados
          let valores: any[] = [];
          // Itera sobre cada campo en this.campoLista
          this.campoLista.forEach((campo) => {
            // Si el campo existe en el registro, agrégalo al objeto valores
            if (registro[campo.name] !== undefined) {
              valores.push({
                ...campo,
                valor: registro[campo.name],
                ...registro,
              });
            }
          });

          // Si el objeto valores no está vacío (tiene al menos un campo), devuélvelo
          if (Object.keys(valores).length > 0) {
            return valores;
          }
        });
      });
  }

  orderPor(nombre: string, i: number) {
    if (this.ordenadoTabla.charAt(0) == '-') {
      this.ordenadoTabla = nombre.toLowerCase();
    } else {
      this.ordenadoTabla = `-${nombre.toLowerCase()}`;
    }
  }

  seleccionar(item: any, index: number) {
    this.modalService.dismissAll();
    this.emitirRegistroSeleccionado.emit(item[index][0]);
  }

  // Función para determinar el tipo de dato y aplicar formato si es necesario
  getTipoDato(campo: any) {
    // Verifica si se proporciona un campo
    if (campo) {
      // Switch para manejar diferentes tipos de campo
      switch (campo.campoTipo) {
        case 'number':
          if (campo.aplicaFormatoNumerico) {
            // Formatea el valor con dos decimales y comas para separar miles
            let formattedValue = campo.valor
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            return `${formattedValue}`;
          }
          return campo.valor;
        // Si el campo es de tipo booleano
        case 'Booleano':
          return campo.valor ? 'SI' : 'NO';
        case 'Porcentaje':
          if (typeof campo.valor === 'string') {
            return `${parseFloat(campo.valor.replace(',', '.'))}`;
          } else if (campo.valor !== null && campo.valor !== undefined) {
            // Convierte `valor` a cadena si no es null o undefined
            return `${parseFloat(String(campo.valor).replace(',', '.'))}`;
          } else {
            return '0'; // O algún valor predeterminado adecuado
          }
        default:
          return campo.valor;
      }
    }
  }

  private _reiniciarFiltros() {
    this.filtros = {};
  }
}
