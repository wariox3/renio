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
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-seleccionar-contacto',
  standalone: true,
  templateUrl: './seleccionar-contacto.component.html',
  styleUrls: ['./seleccionar-contacto.component.scss'],
  imports: [
    TranslateModule,
    NgbDropdownModule,
    NgFor,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class SeleccionarContactoComponent
  extends General
  implements OnChanges, OnInit
{
  private readonly _generalService = inject(GeneralService);

  public itemSeleccionado: RegistroAutocompletarGenContacto | null = null;
  public contactos = signal<RegistroAutocompletarGenContacto[]>([]);
  public searchControl = new FormControl('');
  public parametrosConsulta = signal<ParametrosFiltros>({
    filtros: [],
    limite: 10,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: 'GenContacto',
    serializador: 'ListaAutocompletar',
  });

  @Input() estadoAprobado: boolean = false;
  @Input() campoInvalido: any = false;
  @Input() grande: boolean = false;
  @Input() sugerirPrimerValor: boolean = false;
  @Input() isEdicion: boolean = false;
  @Input() itemNombre: string = '';

  @Output() emitirArrItems: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @Output()
  emitirItemSeleccionado: EventEmitter<RegistroAutocompletarGenContacto> =
    new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.searchControl.setValue(this.itemNombre);
    this._initBuscador();
  }

  initOpciones() {
     this.getContactos(this.parametrosConsulta()).subscribe((respuesta) => {
      this.contactos.set(respuesta.registros);
    });
  }

  private _initBuscador() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((valor) => {
          if (!valor) {
            this.emitirLineaVacia.emit();
          }

          return this.consultarItems(valor);
        }),
      )
      .subscribe((resultado) => {
        this.contactos.set(resultado.registros);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.itemNombre?.currentValue !== null) {
      this.dropdown?.close();
    }
  }

  agregarItem(almacen: RegistroAutocompletarGenContacto) {
    this.itemSeleccionado = almacen;
    this.emitirItemSeleccionado.emit(almacen);
  }

  getContactos(filtros: ParametrosFiltros) {
    return this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarGenContacto>(
      filtros,
    );
  }

  consultarItems(event: string | null) {
    let parametrosConsulta: ParametrosFiltros = this.parametrosConsulta();

    parametrosConsulta = {
      ...parametrosConsulta,
      filtros: [
        ...parametrosConsulta.filtros,
        {
          operador: 'icontains',
          propiedad: 'nombre_corto',
          valor1: `${event}`,
        },
      ],
    };

    return this.getContactos(parametrosConsulta);
  }

  onDropdownClose() {
    if (this.itemSeleccionado === null) {
      this.emitirLineaVacia.emit();
    }
  }
}
