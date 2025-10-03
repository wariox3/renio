import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { FiltroComponent } from '../ui/tabla/filtro/filtro.component';
import { PaginadorComponent } from '../ui/tabla/paginador/paginador.component';
import { HttpService } from '@comun/services/http.service';
import { forkJoin } from 'rxjs';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';
import { FilterField } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';

export interface ColumnaTabla {
  /** Identificador único de la columna */
  id: string;
  /** Título que se mostrará en el encabezado */
  titulo: string;
  /** Clave del objeto que contiene el valor a mostrar */
  campo: string;
  /** Determina si la columna es filtrable */
  filtrable?: boolean;
  /** Tipo de datos de la columna (texto, número, booleano, fecha, etc.) */
  tipo?: 'texto' | 'numero' | 'booleano' | 'fecha' | 'moneda';
  /** Ancho de la columna (puede ser en px, %, etc.) */
  ancho?: string;
  /** Alineación del contenido de la columna */
  alineacion?: 'izquierda' | 'centro' | 'derecha';
  /** Función personalizada para formatear el valor */
  formatearValor?: (valor: any) => string;
}

@Component({
  selector: 'app-buscar-documento-detalles',
  standalone: true,
  imports: [FiltroComponent, PaginadorComponent, CommonModule],
  templateUrl: './buscar-documento-detalles.component.html',
  styleUrl: './buscar-documento-detalles.component.css',
})
export class BuscarDocumentosDetallesComponent implements OnInit {
  /**
   * Columnas que se mostrarán en la tabla
   * Cada columna debe seguir la estructura definida en la interfaz ColumnaTabla
   */
  @Input() columnas: ColumnaTabla[] = [];

  /**
   * Modelo que se está consultando (para traducciones)
   */
  @Input() configuracion: {
    endpoint: string;
    queryParams: { [key: string]: string | number | boolean };
  };

  @Input() detalleId: number = 0;
  @Input() modulo: "venta" | "compra" = "venta";
  @Input() filtrosDisponibles: FilterField[] = []; 

  @Output() itemsSeleccionadosEvent = new EventEmitter<any[]>();
  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  private generalService = inject(GeneralService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private httpService = inject(HttpService);
  private filterTransformerService = inject(FilterTransformerService);

  public items = signal<any[]>([]);
  public itemsSeleccionados = signal<any[]>([]);
  public currentPage = signal(1);
  public cantidadRegistros = signal(0);
  public filtrosAplicados: any = {};

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    const queryParams = {
      ...this.configuracion.queryParams,
      ...this.filtrosAplicados,
      page: this.currentPage()
    };
    
    this.generalService
      .consultaApi<
        RespuestaApi<any>
      >(this.configuracion.endpoint, queryParams)
      .subscribe((res) => {
        this.items.set(res.results);
        this.cantidadRegistros.set(res.count || 0);
      });
  }

  seleccionar(item: any): void {
    // Implementación existente o nueva lógica para manejar la selección
  }

  manejarCheckGlobal(event: any): void {
    if (event.target.checked) {
      this._agregarTodosLosItemsAListaEliminar();
    } else {
      this._removerTodosLosItemsAListaEliminar();
    }

    this.changeDetectorRef.detectChanges();
  }

  manejarCheckItem(event: any, item: any): void {
    if (event.target.checked) {
      this._agregarItemAListaEliminar(item);
    } else {
      this._removerItemDeListaEliminar(item.id);
    }

    this.changeDetectorRef.detectChanges();
  }

  private _agregarTodosLosItemsAListaEliminar() {
    this.items().forEach((registro) => {
      const indexItem = this.itemsSeleccionados().findIndex(item => item.id === registro.id);

      if (indexItem === -1) {
        this.itemsSeleccionados().push(registro);
      }
    });
  }

  private _removerTodosLosItemsAListaEliminar() {
    this.itemsSeleccionados.set([]);
  }

  private _agregarItemAListaEliminar(item: any) {
    this.itemsSeleccionados().push(item);
  }

  private _removerItemDeListaEliminar(id: number) {
    const itemsFiltrados = this.itemsSeleccionados().filter(
      (item) => item.id !== id,
    );
    this.itemsSeleccionados.set(itemsFiltrados);
  }

  estoyEnListaEliminar(id: number): boolean {
    // Implementación existente o nueva lógica para verificar si el item está en la lista de eliminación
    return this.itemsSeleccionados().findIndex(item => item.id === id) !== -1;
  }

  cambiarPaginacion(page: number) {
    this.currentPage.set(page);
    this.getItems();
  }

  obtenerFiltros(arrfiltros: any) {
    const apiParams = this.filterTransformerService.transformToApiParams(arrfiltros);
    this.filtrosAplicados = apiParams;
    this.currentPage.set(1); // Reset to first page when applying filters
    this.getItems();
  }

  agregarDetalles() {
    const itemsAEmitir: any[] = [];

    if (this.modulo === "venta") {
       
    } else {
      
    }

    const requests = this.itemsSeleccionados().map(({item}) => 
      this.httpService.post<any>(`general/item/detalle/`, {
        id: item,
        venta: this.modulo === "venta",
        compra: this.modulo === "compra",
      })
    );

    // Usar forkJoin para esperar a que todas las peticiones se completen
    if (requests.length > 0) {
      forkJoin(requests).subscribe((responses) => {
        responses.forEach((res) => {
          const documento = this.itemsSeleccionados().find(item => item.item === res.item.id);
          itemsAEmitir.push({
            ...res.item,
            documento_detalle_afectado_id: documento.id,
          });
        });
        this.itemsSeleccionadosEvent.emit(itemsAEmitir);
      });
    } else {
      this.itemsSeleccionadosEvent.emit(itemsAEmitir);
    }
  }
}
