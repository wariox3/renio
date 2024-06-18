import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';

import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@interfaces/general/item';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-comun-productos',
  standalone: true,
  imports: [
    TranslateModule,
    NgbDropdownModule,
    NgFor,
    CommonModule,
],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent extends General implements AfterViewInit {

  itemSeleccionado: any | null = null;
  arrItemsLista: any[];
  @Input() itemNombre: string = '';
  @Input() estado_aprobado: false;
  @Input() campoInvalido: any  = false;
  @Output() emitirArrItems: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;

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
    if(this.campoInvalido){
      this.campoInvalido = false
      this.changeDetectorRef.detectChanges()
    }

    this.httpService
      .post<any>(`general/item/detalle/`, {
        'id':item.item_id,
        'venta': true
      })
      .subscribe((respuesta: any) => {
        this.emitirArrItems.emit(respuesta.item);
      });
  }

  consultarItems(event: any) {
    let arrFiltros = {
      filtros: [
        {
          id: '1692284537644-1688',
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
      modelo: 'Item',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: Item[] }>(
        'general/funcionalidad/lista-autocompletar/',
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
          id: '1692284537644-1688',
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
      modelo: 'Item',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: Item[] }>(
        'general/funcionalidad/lista-autocompletar/',
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
    if(this.itemSeleccionado === null){
      this.emitirLineaVacia.emit();
    }
  }
}
