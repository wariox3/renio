import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@interfaces/general/item';
import ItemFormularioComponent from '@modulos/general/componentes/item/item-formulario/item-formulario.component';
import {
  NgbDropdown,
  NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-comun-cuenta-banco',
  standalone: true,
  templateUrl: './cuenta-banco.component.html',
  styleUrls: ['./cuenta-banco.component.scss'],
  imports: [
    TranslateModule,
    NgbDropdownModule,
    CommonModule,
    ItemFormularioComponent,
  ],
})
export class CuentaBancoComponent extends General implements AfterViewInit {
  itemSeleccionado: any | null = null;
  arrItemsLista: any[];
  @Input() itemNombre: string = '';
  @Input() estado_aprobado: false;
  @Input() campoInvalido: any = false;
  @Input() venta: boolean = true;
  @Input() compra: boolean = false;

  @Output() emitirArrItems: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;

  constructor(private httpService: HttpService) {
    super();
  }

  ngAfterViewInit() {
    if (this.inputItem?.nativeElement.value === '') {
      this.inputItem?.nativeElement.focus();
    }
  }

  agregarItem(item: any) {
    this.itemSeleccionado = item;
    if (this.campoInvalido) {
      this.campoInvalido = false;
      this.changeDetectorRef.detectChanges();
    }
    this.emitirArrItems.emit(item);
  }

  consultarItems(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'nombre__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenCuentaBanco',
      serializador: 'ListaAutocompletar',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: Item[] }>(
        'general/funcionalidad/lista/',
        arrFiltros
      )
      .subscribe((respuesta) => {
        this.arrItemsLista = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosItems(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'nombre__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenCuentaBanco',
      serializador: 'ListaAutocompletar',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: Item[] }>(
        'general/funcionalidad/lista/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrItemsLista = respuesta.registros;
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
}
