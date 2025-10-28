import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { GeneralService } from '@comun/services/general.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { debounceTime, distinctUntilChanged, finalize, Subject, switchMap, tap } from 'rxjs';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';

interface selectConfiguracionEndpoint {
  endpoint: string,
  campoBusqueda: string,
  parametros: ParametrosApi,
  debounceTime: number
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgSelectModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true
  }]
})
export class SelectComponent implements OnChanges, OnInit, ControlValueAccessor {
  private readonly _generalService = inject(GeneralService);
  private readonly NEW_ID = 'nuevo';
  private busquedaSubject = new Subject<string>();
  private _selectOptions: any[] = [];
  public value = signal<any>(null);

  public loading = signal<boolean>(false);
  public options = signal<any[]>([]);

  @Input()
  set selectOptions(value: any[]) {
    this._selectOptions = value || [];
    this.options.set(this._selectOptions);
  }
  get selectOptions(): any[] {
    return this._selectOptions;
  }

  @Input() selectLabel: string = 'nombre';
  @Input() selectValue: string = 'id';
  @Input() selectMulti: boolean = false;
  @Input() campoBusqueda: string = '';
  @Input() notFoundText = 'Sin elementos';
  @Input() placeholder = 'Selecciona un elemento';
  @Input({ required: true }) control!: AbstractControl;
  @Input() errors: { [key: string]: string } = {};
  @Input() mostrarNuevo: boolean = false;
  @Input() formatoCustomLabel: (item: any) => string = (item: any) => item[this.selectLabel];
  @Input() invalid: boolean | undefined = false;
  @Input() dirty: boolean | undefined = false;
  @Input() touched: boolean | undefined = false;
  @Input() configuracionEndpoint: selectConfiguracionEndpoint

  @Output() selectionChange = new EventEmitter<any>();
  @Output() valorBusqueda = new EventEmitter<string>();
  @Output() nuevoSeleccionado = new EventEmitter<boolean>();

  onChange = (value: any) => { };

  onTouched = () => { };

  constructor() { }

  ngOnInit(): void {
    if (this.configuracionEndpoint) {
      this._consultarData(this.configuracionEndpoint.parametros);
    }
    this._configurarBusquedaPorDebounce();
    this._inicializarControl();

    // Si el control tiene valor, asígnalo al value local
    if (this.control?.value !== undefined && this.control?.value !== null) {
      this.value.set(this.control.value);
    }

    // Escucha cambios del control para mantener sincronía bidireccional
    this.control?.valueChanges.subscribe((nuevoValor) => {
      this.value.set(nuevoValor);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['configuracionEndpoint'] && !changes['configuracionEndpoint'].firstChange) {
      this._consultarData(this.configuracionEndpoint.parametros);
    }
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onSelectChange(value: any): void {
    this.value = value;
    this.onChange(value); // <- Notifica a Angular del nuevo valor
    this.selectionChange.emit(value); // <- Emite el cambio a componentes padres si lo deseas

    if (this.control) {
      this.control.setValue(value, { emitEvent: true });
      this.control.markAsDirty();
      this.control.markAsTouched();
    }
  }
  emitirSeleccion(data: any) {
    if (data?.[this.value()] === 'nuevo') {
      this.nuevoSeleccionado.emit(true);
      this.control.setValue(null);
    } else {
      this.selectionChange.emit(data);
    }
  }

  get error(): string | null {
    if (!this.control || !this.control.touched || !this.control.errors) {
      return null;
    }

    for (const key of Object.keys(this.control.errors)) {
      if (this.errors[key]) {
        return this.errors[key]; // Mensaje personalizado
      }
    }

    // Fallback genérico si no hay mensaje definido para la clave
    return 'Este campo no es válido.';
  }

  buscarPorValor(event?: any): void {
    const excludedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    if (excludedKeys.includes(event?.key)) {
      return;
    }

    const valor = event?.target.value || '';
    this.busquedaSubject.next(valor);
  }

  busquedaInicial() {
    this._consultarDataPorCampoBusqueda('');
  }

  private _consultarData(valor: ParametrosApi) {
    return this._generalService
      .consultaApi(this.configuracionEndpoint.endpoint, valor)
      .pipe(
        tap(() => this.loading.set(true)),
        finalize(() => this.loading.set(false))
      )
      .subscribe((respuesta: any) => {
        this._procesarRespuesta(respuesta);
      });
  }

  private _consultarDataPorCampoBusqueda(valor: string) {
    return this._generalService
      .consultaApi(this.configuracionEndpoint.endpoint, {
        ...this.configuracionEndpoint.parametros,
        [this.configuracionEndpoint.campoBusqueda]: valor,
      })
      .pipe(
        debounceTime(this.configuracionEndpoint.debounceTime),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        finalize(() => this.loading.set(false))
      )
      .subscribe((respuesta: any) => {
        this._procesarRespuesta(respuesta);
      });
  }

  private _procesarRespuesta(respuesta: any) {
    let datos = respuesta.results ?? respuesta;

    datos = datos.map((item: any) => ({
      ...item,
      [this.selectLabel]: this.formatoCustomLabel(item),
    }));

    if (this.mostrarNuevo) {
      datos = [...datos, { id: 'nuevo', [this.selectLabel]: 'Nuevo' }];
    }

    this.options.set(datos);
  }

  public searchFn = (term: string, item: any) => {
    if (item?.[this.value()] === this.NEW_ID) return true;
    const label = (item?.[this.selectLabel] ?? '').toString().toLowerCase();
    return label.indexOf((term || '').toLowerCase()) > -1;
  };

  shouldShowErrors(): boolean {
    // Si tenemos acceso al control, usamos sus propiedades
    if (this.control) {
      return this.control.invalid && (this.control.dirty || this.control.touched);
    }
    // Si no, usamos las propiedades pasadas directamente
    return this.invalid === true && (this.dirty === true || this.touched === true);
  }

  getErrors(): string[] {
    if (!this.errors) return [];

    // Si tenemos acceso al control, verificamos qué errores específicos están ocurriendo
    if (this.control && this.control.errors) {
      const activeErrors: string[] = [];

      // Recorremos las claves de los errores del control
      Object.keys(this.control.errors).forEach(errorKey => {
        // Convertimos el errorKey a camelCase si es necesario (minlength -> minLength)
        const normalizedKey = this.normalizeErrorKey(errorKey);

        // Si tenemos un mensaje para este error, lo añadimos
        if (this.errors[normalizedKey]) {
          activeErrors.push(this.errors[normalizedKey]);
        }
      });

      return activeErrors;
    }

    return [];
  }

  // Normaliza las claves de error (convierte minlength a minLength, etc.)
  private normalizeErrorKey(key: string): string {
    // Mapa de conversiones comunes
    const keyMap: { [key: string]: string } = {
      minlength: 'minLength',
      maxlength: 'maxLength',
      required: 'required',
      pattern: 'pattern',
      email: 'email',
    };

    return keyMap[key] || key;
  }

  private _configurarBusquedaPorDebounce(): void {
    this.busquedaSubject
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap(valor =>
          this._generalService.consultaApi(this.configuracionEndpoint.endpoint, {
            ...this.configuracionEndpoint.parametros,
            [this.configuracionEndpoint.campoBusqueda]: valor,
          })
            .pipe(finalize(() => this.loading.set(false)))
        )
      )
      .subscribe({
        next: (respuesta: any) => this._procesarRespuesta(respuesta),
        error: (err) => {
          console.error('Error en la búsqueda:', err);
          this.loading.set(false);
        }
      });
  }

  private _inicializarControl(): void {
    if (!this.control) return;

    // Inicializa el valor local con el del control
    const valorInicial = this.control.value;
    if (valorInicial !== undefined && valorInicial !== null) {
      this.value.set(valorInicial);
    }

    // Sincroniza cambios entre el control y el signal
    this.control.valueChanges.subscribe((nuevoValor) => {
      this.value.set(nuevoValor);
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
