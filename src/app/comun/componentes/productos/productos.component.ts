import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@modulos/general/modelos/item';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-comun-productos',
  standalone: true,
  imports: [
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
    NgIf,
    NgFor,
    CommonModule,
  ],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent extends General implements AfterViewInit {
  itemSeleccionado: Item | null = null;
  arrItemsLista: Item[];
  @Output() emitirArrItems: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;

  constructor(private httpService: HttpService) {
    super();
  }

  ngAfterViewInit() {
    this.inputItem.nativeElement.click();
    this.inputItem.nativeElement.focus();
  }

  agregarItem(item: Item) {
    this.itemSeleccionado = item;

    this.httpService.get<any>(`general/item/${item.id}/`).subscribe((respuesta)=>{
      this.emitirArrItems.emit(respuesta);
      
    })
    this.changeDetectorRef.detectChanges();
    this.emitirArrItems.emit(this.itemSeleccionado);
  }


  consultarItems(event:any) {

    let arrFiltros = {
      filtros: [
        {
          id:"1692284537644-1688",
          operador: "__contains",
          propiedad:"nombre__contains",
          valor1: `${event?.target.value}`,
          valor2: "",
        }
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

  aplicarFiltrosItems(event:any){
    let arrFiltros = {
      filtros: [
        {
          id:"1692284537644-1688",
          operador: "__contains",
          propiedad:"nombre__contains",
          valor1: `${event?.target.value}`,
          valor2: "",
        }
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
        throttleTime(300, asyncScheduler, {leading: true, trailing: true}),
        tap(respuesta => {
          this.arrItemsLista = respuesta.registros;
          this.inputItem.nativeElement.focus();
          this.changeDetectorRef.detectChanges();
        })

      )
      .subscribe();

    console.log(arrFiltros);

  }

}
