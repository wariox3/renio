import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
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
import { Item, ItemSeleccionar } from '@interfaces/general/item.interface';
import { asyncScheduler, tap, throttleTime } from 'rxjs';
import ItemFormularioComponent from '@modulos/general/paginas/item/item-formulario/item-formulario.component';
import {
  DocumentoDetalleFactura,
  RespuestaItem,
} from '@interfaces/comunes/factura/factura.interface';
import { GeneralService } from '@comun/services/general.service';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';

@Component({
  selector: 'app-seleccionar-producto',
  standalone: true,
  templateUrl: './seleccionar-producto.component.html',
  styleUrls: ['./seleccionar-producto.component.scss'],
  imports: [
    TranslateModule,
    NgbDropdownModule,
    NgFor,
    CommonModule,
    ItemFormularioComponent,
  ],
})
export class SeleccionarProductoComponent
  extends General
  implements AfterViewInit, OnChanges
{
  itemSeleccionado: ItemSeleccionar | null = null;
  arrItemsLista: ItemSeleccionar[];
  @Input() itemNombre: string = '';
  @Input() estadoAprobado: boolean = false;
  @Input() campoInvalido: any = false;
  @Input() venta: boolean = true;
  @Input() compra: boolean = false;
  @Input() formularioTipo: 'venta' | 'compra' = 'venta';

  @Output() emitirArrItems: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @Output() emitirItemSeleccionado: EventEmitter<DocumentoDetalleFactura> =
    new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;

  private readonly _generalService = inject(GeneralService);

  constructor(
    private httpService: HttpService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.itemNombre?.currentValue !== null) {
      this.dropdown?.close();
    }
  }

  ngAfterViewInit() {
    if (this.inputItem?.nativeElement.value === '') {
      this.inputItem?.nativeElement.focus();
    }
  }

  validarValor() {
    if (this.inputItem.nativeElement.value === '') {
      this.emitirLineaVacia.emit(true);
    }
  }

  agregarItem(item: ItemSeleccionar) {
    let parametrosConsulta = {
      id: item.id,
      venta: false,
      compra: false,
    };

    this.itemSeleccionado = item;
    if (this.campoInvalido) {
      this.campoInvalido = false;
      this.changeDetectorRef.detectChanges();
    }

    switch (this.formularioTipo) {
      case 'compra':
        parametrosConsulta = {
          ...parametrosConsulta,
          compra: true,
        };
        break;
      case 'venta':
        parametrosConsulta = {
          ...parametrosConsulta,
          venta: true,
        };
        break;
    }

    this.httpService
      .post<RespuestaItem>(`general/item/detalle/`, parametrosConsulta)
      .subscribe((respuesta) => {
        this.emitirItemSeleccionado.emit(respuesta.item);
      });
  }

  consultarItems(event: any) {
    this._generalService
      .consultaApi<ItemSeleccionar[]>('general/item/seleccionar/', {
        nombre__icontains: `${event?.target.value}`,
        inactivo: 'False',
      })
      .subscribe((respuesta) => {
        this.arrItemsLista = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosItems(event: any) {
    this._generalService
      .consultaApi<ItemSeleccionar[]>('general/item/seleccionar/', 
        {
          nombre__icontains: `${event?.target.value}`,
          inactivo: 'False',
        }
      )
      .pipe(
        tap((respuesta) => {
          this.arrItemsLista = respuesta;
          this.inputItem.nativeElement.focus();
          this.changeDetectorRef.detectChanges();
        }),
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
    this.emitirItemSeleccionado.emit(respuestaItem.item);
    this.changeDetectorRef.detectChanges();
    this.modalService.dismissAll();
    this.changeDetectorRef.detectChanges();
  }
}
