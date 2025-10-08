import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, Optional } from '@angular/core';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import {
  NgbActiveModal,
  NgbDatepickerModule,
  NgbModal,
  NgbModalRef,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KeysPipe } from '@pipe/keys.pipe';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FiltroComponent } from '../ui/tabla/filtro/filtro.component';
import { TipoDatoPipe } from '@pipe/tipoDato.pipe';
import { FiltroSwitchConfig, FiltroSwitchEvent } from '@comun/interfaces/filtro-switch.interface';

@Component({
  selector: 'app-comun-buscar-avanzado',
  standalone: true,
  imports: [
    CommonModule,
    NgbDatepickerModule,
    KeysPipe,
    TranslateModule,
    NgbTooltipModule,
    FiltroComponent,
    TipoDatoPipe
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
  public filtrosSwitches: any = {}; // Filtros aplicados por los switches
  @Input() consultarUrl = '';
  @Input() tituloModal = '';
  @Input() campoLista: any[] = [];
  @Input() campoFiltros: any[] = [];
  @Input() filtrosPermanentes: any = {};
  @Input() switchesConfig: FiltroSwitchConfig[] = []; // Configuración de switches de filtro
  @Output() emitirRegistroSeleccionado: EventEmitter<any> = new EventEmitter();
  @Output() emitirCambioSwitch: EventEmitter<FiltroSwitchEvent> = new EventEmitter();
  
  modalRef: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
  ) {
    super();
  }

  abirModal(content: any) {
    this._reiniciarFiltros();
    this._inicializarFiltrosSwitches();
    this.consultarLista();
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
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
        ...this.filtrosPermanentes,
        ...this.filtros,
        ...this.filtrosSwitches,
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
    // Si activeModal está disponible (componente usado dentro de un modal), cerrar el modal
    if (this.modalRef) {
      this.modalRef.close();
    }
    this.emitirRegistroSeleccionado.emit(item[index][0]);
  }

  private _reiniciarFiltros() {
    this.filtros = {};
    // Reiniciar switches a su estado inicial
    this._inicializarFiltrosSwitches();
  }

  private _inicializarFiltrosSwitches() {
    this.filtrosSwitches = {};
    this.switchesConfig.forEach(switchConfig => {
      if (switchConfig.parametroApi) {
        const valor = switchConfig.checked ? switchConfig.valorTrue : switchConfig.valorFalse;
        if (valor !== undefined && valor !== null) {
          this.filtrosSwitches[switchConfig.parametroApi] = valor;
        }
      }
    });
  }

  onSwitchChange(switchConfig: FiltroSwitchConfig, checked: boolean) {
    // Actualizar el estado del switch en la configuración
    switchConfig.checked = checked;
    
    // Actualizar filtros de switches
    if (switchConfig.parametroApi) {
      const valor = checked ? switchConfig.valorTrue : switchConfig.valorFalse;
      if (valor !== undefined && valor !== null) {
        this.filtrosSwitches[switchConfig.parametroApi] = valor;
      } else {
        delete this.filtrosSwitches[switchConfig.parametroApi];
      }
    }
    
    // Emitir evento de cambio
    const evento: FiltroSwitchEvent = {
      id: switchConfig.id,
      checked: checked,
      parametroApi: switchConfig.parametroApi,
      valor: checked ? switchConfig.valorTrue : switchConfig.valorFalse
    };
    
    this.emitirCambioSwitch.emit(evento);
    
    // Consultar lista con los nuevos filtros
    this.consultarLista();
  }
}
