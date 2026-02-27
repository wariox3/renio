import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@interfaces/general/item.interface';
import { asyncScheduler, tap, throttleTime } from 'rxjs';
import { GeneralService } from '@comun/services/general.service';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import ItemFormularioComponent from '@modulos/general/paginas/item/item-formulario/item-formulario.component';

/**
 * @deprecated Usar `SelectorComponent` (`<app-selector>`) de `src/app/common/components/ui/form/selector/` en su lugar.
 * Este componente será eliminado en una versión futura.
 */
@Component({
  selector: 'app-comun-productos',
  standalone: true,
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
  imports: [
    TranslateModule,
    NgbDropdownModule,
    NgFor,
    CommonModule,
    ItemFormularioComponent,
  ],
})
export class ProductosComponent extends General implements AfterViewInit {
  itemSeleccionado: any | null = null;
  arrItemsLista: Item[] = [];
  @Input() itemNombre: string = '';
  @Input() estadoAprobado: false;
  @Input() campoInvalido: any = false;
  @Input() venta: boolean = true;
  @Input() compra: boolean = false;

  @Output() emitirArrItems: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;

  private readonly _generalService = inject(GeneralService);

  constructor(
    private httpService: HttpService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngAfterViewInit() {
    if (this.inputItem?.nativeElement.value === '') {
      this.inputItem?.nativeElement.focus();
    }
  }

  agregarItem(item: Item) {
    this.itemSeleccionado = item;
    if (this.campoInvalido) {
      this.campoInvalido = false;
      this.changeDetectorRef.detectChanges();
    }

    this.httpService
      .post<any>(`general/item/detalle/`, {
        id: item.id,
        venta: this.venta,
        compra: this.compra,
      })
      .subscribe((respuesta: any) => {
        this.emitirArrItems.emit(respuesta.item);
      });
  }

  consultarItems(event: any) {
    this._generalService
      .consultaApi<Item[]>(
        'general/item/seleccionar/',
        {
          nombre__icontains: event?.target.value,
        })
      .subscribe((respuesta) => {
        this.arrItemsLista = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosItems(event: any) {
    this._generalService
      .consultaApi<Item[]>(
        'general/item/seleccionar/',
        {
          nombre__icontains: event?.target.value,
        })
      .pipe(
        tap((respuesta) => {
          this.arrItemsLista = respuesta;
          this.inputItem.nativeElement.focus();
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  onDropdownClose() {
    if (this.itemSeleccionado === null) {
      this.emitirLineaVacia.emit();
    }
  }

  abrirModalNuevoItem(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  cerrarModalNuevoItem(respuestaItem: any): void {
    this.emitirArrItems.emit(respuestaItem.item);
    this.changeDetectorRef.detectChanges();
    this.modalService.dismissAll();
    this.changeDetectorRef.detectChanges();
  }
}
