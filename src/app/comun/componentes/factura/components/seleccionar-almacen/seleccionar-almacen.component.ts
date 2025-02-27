import { CommonModule, NgFor } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-almacen.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-seleccionar-almacen',
  standalone: true,
  templateUrl: './seleccionar-almacen.component.html',
  styleUrls: ['./seleccionar-almacen.component.scss'],
  imports: [TranslateModule, NgbDropdownModule, NgFor, CommonModule],
})
export class SeleccionarAlmacenComponent extends General implements OnChanges {
  itemSeleccionado: RegistroAutocompletarInvAlmacen | null = null;
  public almacenes = signal<RegistroAutocompletarInvAlmacen[]>([]);

  @Input() itemNombre: string = '';
  @Input() estadoAprobado: boolean = false;
  @Input() campoInvalido: any = false;
  @Input() grande: boolean = false;

  @Output() emitirArrItems: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @Output()
  emitirItemSeleccionado: EventEmitter<RegistroAutocompletarInvAlmacen> =
    new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;

  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.itemNombre?.currentValue !== null) {
      this.dropdown?.close();
    }
  }

  agregarItem(almacen: RegistroAutocompletarInvAlmacen) {
    this.itemSeleccionado = almacen;
    this.emitirItemSeleccionado.emit(almacen);
  }

  consultarItems(event: any) {
    let arrFiltros: ParametrosFiltros = {
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
    };

    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarInvAlmacen>(arrFiltros)
      .subscribe((respuesta) => {
        this.almacenes.set(respuesta.registros);
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosItems(event: any) {
    let arrFiltros: ParametrosFiltros = {
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
    };

    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarInvAlmacen>(arrFiltros)
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.almacenes.set(respuesta.registros);
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
}
