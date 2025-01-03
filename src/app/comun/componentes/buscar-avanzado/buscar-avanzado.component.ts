import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { General } from '@comun/clases/general';
import { mapeo } from '@comun/extra/mapeo-entidades/buscar-avanzados';
import { HttpService } from '@comun/services/http.service';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import {
  NgbDatepickerModule,
  NgbModal,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { KeysPipe } from '@pipe/keys.pipe';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { BaseFiltroComponent } from '../base-filtro/base-filtro.component';
import { Modelo } from '@comun/type/modelo.type';

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
  ],
  templateUrl: './buscar-avanzado.component.html',
  styleUrls: ['./buscar-avanzado.component.scss'],
})
export class BuscarAvanzadoComponent extends General {
  closeResult = '';
  arrPropiedades: any;
  ordenadoTabla: string = '';
  arrItems: any[];
  @Input() consultarModelo = '';
  @Input() campoLista: CampoLista[] = [];
  @Input() campoFiltros: string[] = [];
  @Input() filtrosPermanentes: any = {};
  @Input() consultarTipo: 'Administrador' | 'Documento';
  @Output() emitirRegistroSeleccionado: EventEmitter<any> = new EventEmitter();

  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: '',
    tipo: '',
  };

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService
  ) {
    super();
  }

  abirModal(content: any) {
    this.arrParametrosConsulta.filtros = [];
    this.consultarLista();
    let posicion: keyof typeof mapeo = this.consultarModelo as Modelo;

    this.store.dispatch(ActualizarMapeo({ dataMapeo: mapeo[posicion] }));

    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  obtenerFiltros(arrfiltros: any) {
    this.arrParametrosConsulta.filtros = [...arrfiltros];
    this.consultarLista();
  }

  consultarLista() {
    this.arrParametrosConsulta.modelo = this.consultarModelo;
    this.arrParametrosConsulta.tipo = this.consultarTipo;
    let baseUrl = 'general/';
    switch (this.consultarTipo) {
      case 'Administrador':
        baseUrl += 'funcionalidad/lista/';
        break;
      case 'Documento':
        baseUrl += 'funcionalidad/lista/';
        break;
    }

    if (Array.isArray(this.filtrosPermanentes)) {
      this.arrParametrosConsulta.filtros = [
        ...this.arrParametrosConsulta.filtros,
        ...this.filtrosPermanentes,
      ];
    } else {
      if (Object.keys(this.filtrosPermanentes).length > 0) {
        this.arrParametrosConsulta.filtros[0] = this.filtrosPermanentes;
      }
    }

    this.httpService
      .post<{
        cantidad_registros: number;
        registros: any[];
        propiedades: any[];
      }>(baseUrl, this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        // Mapea cada registro en respuesta.registros para crear un nuevo array this.arrItems
        this.arrItems = respuesta.registros.map((registro) => {
          // Inicializa un objeto vacío para almacenar los valores de los campos especificados
          let valores: any = {};
          // Itera sobre cada campo en this.campoLista
          this.campoLista.forEach((campo) => {
            // Si el campo existe en el registro, agrégalo al objeto valores
            if (registro[campo.propiedad] !== undefined) {
              valores[campo.propiedad] = registro[campo.propiedad];
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

  seleccionar(item: any) {
    this.modalService.dismissAll();
    this.emitirRegistroSeleccionado.emit(item);
  }
}
