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
import { HttpService } from '@comun/services/http.service';

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
  selector: 'app-agregar-detalles-documento',
  standalone: true,
  imports: [FiltroComponent, CommonModule],
  templateUrl: './agregar-detalles-documento.component.html',
  styleUrl: './agregar-detalles-documento.component.css',
})
export class AgregarDetallesDocumentoComponent implements OnInit {
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
    queryParams: { [key: string]: any };
  };

  @Input() detalleId: number = 0;

  @Output() itemsSeleccionadosEvent = new EventEmitter<any[]>();
  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  private generalService = inject(GeneralService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private httpService = inject(HttpService);

  public items = signal<any[]>([]);
  public itemsSeleccionados = signal<number[]>([]);

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    this.generalService
      .consultaApi<
        any[]
      >(this.configuracion.endpoint, this.configuracion.queryParams)
      .subscribe((res) => {
        this.items.set(res);
      });
  }

  seleccionar(item: any): void {
    // Implementación existente o nueva lógica para manejar la selección
  }

  manejarCheckGlobal(event: any): void {
    // Implementación existente o nueva lógica para manejar el check global
    if (event.target.checked) {
      this._agregarTodosLosItemsAListaEliminar();
    } else {
      this._removerTodosLosItemsAListaEliminar();
    }

    this.changeDetectorRef.detectChanges();
  }

  manejarCheckItem(event: any, id: number): void {
    // Implementación existente o nueva lógica para manejar el check individual
    if (event.target.checked) {
      this._agregarItemAListaEliminar(id);
    } else {
      this._removerItemDeListaEliminar(id);
    }

    this.changeDetectorRef.detectChanges();
  }

  private _agregarTodosLosItemsAListaEliminar() {
    this.items().forEach((registro) => {
      const indexItem = this.itemsSeleccionados().indexOf(registro.id);

      if (indexItem === -1) {
        this.itemsSeleccionados().push(registro.id);
      }
    });
  }

  private _removerTodosLosItemsAListaEliminar() {
    this.itemsSeleccionados.set([]);
  }

  private _agregarItemAListaEliminar(id: number) {
    this.itemsSeleccionados().push(id);
  }

  private _removerItemDeListaEliminar(id: number) {
    const itemsFiltrados = this.itemsSeleccionados().filter(
      (item) => item !== id,
    );
    this.itemsSeleccionados.set(itemsFiltrados);
  }

  estoyEnListaEliminar(id: number): boolean {
    // Implementación existente o nueva lógica para verificar si el item está en la lista de eliminación
    return this.itemsSeleccionados().indexOf(id) !== -1;
  }

  agregarDetalles() {
      this.httpService.post<any>(`general/documento_detalle/agregar_documento_detalle/`, {
        documento_id: this.detalleId,
        documento_detalle_ids: this.itemsSeleccionados(),
      }).subscribe((res) => {
        console.log(res); 
      });
  }
}
