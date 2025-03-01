import { CommonModule, NgFor } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarInvAlmacen } from '@interfaces/comunes/autocompletar/inventario/inv-almacen.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-seleccionar-almacen',
  standalone: true,
  templateUrl: './seleccionar-almacen.component.html',
  styleUrls: ['./seleccionar-almacen.component.scss'],
  imports: [
    TranslateModule,
    NgbDropdownModule,
    NgFor,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class SeleccionarAlmacenComponent
  extends General
  implements OnChanges, OnInit
{
  itemSeleccionado: RegistroAutocompletarInvAlmacen | null = null;
  @Input() itemNombre: string = '';

  public almacenes = signal<RegistroAutocompletarInvAlmacen[]>([]);
  public searchControl = new FormControl('');

  @Input() estadoAprobado: boolean = false;
  @Input() campoInvalido: any = false;
  @Input() grande: boolean = false;
  @Input() sugerirPrimerValor: boolean = false;
  @Input() isEdicion: boolean = false;

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

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getAlmacenes({
      filtros: [],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'InvAlmacen',
      serializador: 'ListaAutocompletar',
    }).subscribe((respuesta) => {
      this.almacenes.set(respuesta.registros);
      this._sugerirPrimerValor();
    });
    this.searchControl.setValue(this.itemNombre);
    this._initBuscador();
  }

  private _initBuscador() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Espera 2 segundos antes de continuar
        distinctUntilChanged(), // Solo continúa si el valor ha cambiado
        switchMap((valor) => {
          if (!valor) {
            this.emitirLineaVacia.emit();
          }

          return this.consultarItems(valor);
        }),
      )
      .subscribe((resultado) => {
        this.almacenes.set(resultado.registros);
      });
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

  getAlmacenes(filtros: ParametrosFiltros) {
    return this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarInvAlmacen>(
      filtros,
    );
  }

  consultarItems(event: string | null) {
    let filtros: ParametrosFiltros = {
      filtros: [
        {
          propiedad: 'nombre__icontains',
          valor1: `${event}`,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'InvAlmacen',
      serializador: 'ListaAutocompletar',
    };

    return this.getAlmacenes(filtros);
  }

  private _sugerirPrimerValor() {
    if (this.sugerirPrimerValor && !this.isEdicion) {
      const almacenes = this.almacenes();
      if (almacenes.length) {
        this.emitirItemSeleccionado.emit(almacenes[0]);
      }
    }
  }

  onDropdownClose() {
    if (this.itemSeleccionado === null) {
      this.emitirLineaVacia.emit();
    }
  }
}
