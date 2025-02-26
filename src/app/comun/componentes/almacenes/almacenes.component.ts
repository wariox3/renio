import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-alamacen';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-comun-almacenes',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDropdownModule],
  templateUrl: './almacenes.component.html',
  styleUrl: './almacenes.component.scss'
})
export class AlmacenesComponent extends General {
  itemSeleccionado: any | null = null;
  arrAlmacenes: any[];
  @Input() almacenNombre: string = '';
  @Input() estadoAprobado: false;
  @Input() campoInvalido: any = false;
  @Input() inputSm = false;
  @Output() emitirAlmacen: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;

  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
  }

  validarValor(){
    if(this.inputItem.nativeElement.value === ''){
      this.emitirLineaVacia.emit(true)
    }
  }

  agregarAlmacen(item: any) {
    this.itemSeleccionado = item;
    this.almacenNombre = item.almacen_nombre;
    this.emitirAlmacen.emit(item);
  }

  consultarAlmacenes(event: any) {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarInvAlmacen>({
        filtros: [
          {
            propiedad: 'nombre__icontains',
            valor1: `${event?.target.value}`,
          },
        ],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'InvAlmacen',
        serializador: 'ListaAutocompletar',
      })
      .subscribe((respuesta) => {
        this.arrAlmacenes = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosContactos(event: any) {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarInvAlmacen>({
        filtros: [
          {
            propiedad: 'nombre__icontains',
            valor1: `${event?.target.value}`,
          },
        ],
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'InvAlmacen',
        serializador: 'ListaAutocompletar',
      })
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrAlmacenes = respuesta.registros;
          this.inputItem.nativeElement.focus();
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }
}
