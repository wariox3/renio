import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { GeneralService } from '@comun/services/general.service';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

/**
 * SelectorComponent — Componente selector unificado basado en ng-select.
 *
 * Reemplaza los selectores individuales (activo-grupo, metodo-depreciacion, tipo-costo, resolucion)
 * con un único componente configurable que soporta:
 *
 * - Carga de datos desde cualquier endpoint API
 * - Búsqueda local (filtrado client-side por defecto)
 * - Búsqueda server-side con debounce (cuando se define `searchField`)
 * - Auto-selección del primer valor (modo creación)
 * - Integración con Reactive Forms via ControlValueAccessor
 * - Validación con mensajes de error personalizados
 * - Tres tamaños: sm, md, lg
 *
 * Implementa ControlValueAccessor para funcionar con formControlName y ngModel.
 *
 * @example
 * <!-- Selector simple (carga y muestra una lista) -->
 * <app-selector
 *   endpoint="contabilidad/activo_grupo/seleccionar/"
 *   [parametros]="{ limit: 100 }"
 *   labelField="nombre"
 *   valueField="id"
 *   [control]="formulario.get('grupo')">
 * </app-selector>
 *
 * @example
 * <!-- Selector con búsqueda server-side -->
 * <app-selector
 *   endpoint="general/resolucion/seleccionar/"
 *   [parametros]="{ venta: 'True' }"
 *   labelField="numero"
 *   valueField="id"
 *   searchField="numero__icontains"
 *   [control]="formulario.get('resolucion')"
 *   (selectionChange)="onResolucionSeleccionada($event)">
 * </app-selector>
 *
 * @example
 * <!-- Selector que auto-selecciona el primer valor en modo creación -->
 * <app-selector
 *   endpoint="contabilidad/metodo_depreciacion/seleccionar/"
 *   [parametros]="{ limite: 100 }"
 *   [sugerirPrimerValor]="true"
 *   [isEdicion]="!!detalle"
 *   [control]="formulario.get('metodo_depreciacion')">
 * </app-selector>
 */
@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectorComponent),
      multi: true,
    },
  ],
})
export class SelectorComponent implements OnInit, OnChanges, ControlValueAccessor {
  private readonly _generalService = inject(GeneralService);
  private readonly _cdr = inject(ChangeDetectorRef);

  /** Subject que emite el texto de búsqueda para el debounce server-side */
  private readonly _busquedaSubject = new Subject<string>();

  /** Lista de opciones disponibles en el dropdown */
  public options = signal<any[]>([]);

  /** Indica si se están cargando datos del API */
  public loading = signal<boolean>(false);

  /** Valor actualmente seleccionado (el valor del campo valueField) */
  public value: any = null;

  // ─── INPUTS: Configuración de datos ───────────────────────────────────

  /** Endpoint del API para consultar las opciones. Ej: 'contabilidad/activo_grupo/seleccionar/' */
  @Input({ required: true }) endpoint: string;

  /** Parámetros adicionales enviados al API. Ej: { limit: 100 } o { compra: 'True' } */
  @Input() parametros: Record<string, any> = {};

  /** Campo del objeto que se muestra como texto de la opción. Por defecto: 'nombre' */
  @Input() labelField: string = 'nombre';

  /** Campo del objeto que se usa como valor seleccionado. Por defecto: 'id' */
  @Input() valueField: string = 'id';

  /**
   * Campo para búsqueda server-side. Ej: 'numero__icontains'.
   * Si está vacío, la búsqueda es local (client-side).
   * Si tiene valor, cada tecleo dispara una consulta al API con este campo como filtro.
   */
  @Input() searchField: string = '';

  // ─── INPUTS: Configuración de UX ─────────────────────────────────────

  /** Texto placeholder cuando no hay selección */
  @Input() placeholder: string = '';

  /** Texto que se muestra cuando no hay resultados */
  @Input() notFoundText: string = 'Sin elementos';

  /** Permite limpiar la selección con el botón X */
  @Input() clearable: boolean = true;

  /** Elemento del DOM donde se adjunta el dropdown. null usa el contenedor por defecto */
  @Input() appendTo: string = '';

  /** Tamaño visual del componente: 'sm' (compacto), 'md' (normal), 'lg' (grande) */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  /** Tiempo de espera en ms antes de ejecutar búsqueda server-side */
  @Input() debounceTime: number = 300;

  // ─── INPUTS: Comportamiento ───────────────────────────────────────────

  /**
   * Si es true, auto-selecciona el primer item después de cargar los datos.
   * Solo aplica en modo creación (cuando isEdicion es false).
   */
  @Input() sugerirPrimerValor: boolean = false;

  /**
   * Indica si el formulario está en modo edición.
   * Cuando es true, NO se auto-selecciona el primer valor aunque sugerirPrimerValor sea true.
   */
  @Input() isEdicion: boolean = false;

  /**
   * Función para personalizar el texto que se muestra en cada opción.
   * Recibe el objeto completo y debe retornar un string.
   * Ej: [formatoCustomLabel]="item => item.codigo + ' - ' + item.nombre"
   */
  @Input() formatoCustomLabel: (item: any) => string;

  // ─── INPUTS: Validación ───────────────────────────────────────────────

  /**
   * Referencia al AbstractControl del reactive form.
   * Permite sincronizar el valor y mostrar errores automáticamente.
   * Opcional: el componente funciona también sin él (usando ngModel internamente).
   */
  @Input() control: AbstractControl | null;

  /**
   * Mapa de mensajes de error personalizados.
   * Las claves son los nombres de los validadores, los valores son los mensajes.
   * Ej: { required: 'Este campo es obligatorio', minLength: 'Mínimo 3 caracteres' }
   */
  @Input() errors: { [key: string]: string } = {};

  /** Flags manuales de validación (se usan cuando no se pasa un control) */
  @Input() invalid: boolean = false;
  @Input() dirty: boolean = false;
  @Input() touched: boolean = false;

  // ─── OUTPUTS ──────────────────────────────────────────────────────────

  /**
   * Emite el objeto completo del item seleccionado (no solo el id).
   * Emite null cuando se limpia la selección.
   */
  @Output() selectionChange = new EventEmitter<any>();

  // ─── ControlValueAccessor ─────────────────────────────────────────────

  onChange = (_value: any) => {};
  onTouched = () => {};

  ngOnInit(): void {
    this._cargarDatos();
    this._configurarBusqueda();
    this._inicializarControl();
  }

  /**
   * Recarga los datos cuando cambian endpoint o parametros dinámicamente.
   * Ignora el primer cambio (ya se carga en ngOnInit).
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['endpoint'] && !changes['endpoint'].firstChange) ||
      (changes['parametros'] && !changes['parametros'].firstChange)
    ) {
      this._cargarDatos();
    }
  }

  // --- ControlValueAccessor: métodos requeridos por la interfaz ---

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Se ejecuta cuando el usuario selecciona una opción en el dropdown.
   * Actualiza el valor interno, notifica al form control, y emite el objeto completo.
   */
  onValueChange(value: any): void {
    this.value = value;
    this.onChange(value);

    // Busca el objeto completo para emitirlo (no solo el id)
    const selectedItem = this.options().find(
      (item) => item[this.valueField] === value
    );
    this.selectionChange.emit(selectedItem || null);

    if (this.control) {
      this.control.setValue(value, { emitEvent: true });
      this.control.markAsDirty();
      this.control.markAsTouched();
    }
  }

  /**
   * Maneja el evento keyup del input de búsqueda.
   * Solo actúa si searchField está definido (búsqueda server-side).
   * Ignora teclas de navegación para evitar consultas innecesarias.
   */
  onSearch(event: any): void {
    if (!this.searchField) return;

    const excludedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (excludedKeys.includes(event?.key)) return;

    const valor = event?.target?.value || '';
    this._busquedaSubject.next(valor);
  }

  /**
   * Al hacer focus, recarga datos si es búsqueda server-side.
   * Esto asegura que el dropdown muestre opciones actualizadas.
   */
  onFocus(): void {
    if (this.searchField) {
      this._cargarDatos();
    }
  }

  /** Limpia la selección y notifica al control y a los listeners */
  onClear(): void {
    this.selectionChange.emit(null);
    if (this.control) {
      this.control.setValue(null);
    }
  }

  /**
   * Función de búsqueda pasada a ng-select.
   * - Si hay searchField: retorna true siempre (la búsqueda la hace el servidor).
   * - Si no hay searchField: filtra localmente por el labelField.
   */
  public localSearchFn = (term: string, item: any): boolean => {
    if (this.searchField) return true;
    if (!item || !this.labelField) return false;
    const label = (item[this.labelField] ?? '').toString().toLowerCase();
    const searchTerm = (term || '').toLowerCase();
    return label.includes(searchTerm);
  };

  /** Retorna la clase CSS según el tamaño configurado */
  sizeClass(): string {
    switch (this.size) {
      case 'sm':
        return 'selector-sm';
      case 'lg':
        return 'selector-lg';
      default:
        return '';
    }
  }

  /**
   * Determina si se deben mostrar mensajes de error.
   * Usa el control si está disponible, si no, usa los flags manuales.
   */
  shouldShowErrors(): boolean {
    if (this.control) {
      return this.control.invalid && (this.control.dirty || this.control.touched);
    }
    return this.invalid === true && (this.dirty === true || this.touched === true);
  }

  /**
   * Retorna la lista de mensajes de error activos.
   * Compara los errores del control con el mapa de mensajes `errors`.
   */
  getErrors(): string[] {
    if (!this.errors) return [];

    if (this.control && this.control.errors) {
      const activeErrors: string[] = [];
      Object.keys(this.control.errors).forEach((errorKey) => {
        const normalizedKey = this._normalizeErrorKey(errorKey);
        if (this.errors[normalizedKey]) {
          activeErrors.push(this.errors[normalizedKey]);
        }
      });
      return activeErrors;
    }

    return [];
  }

  // ─── MÉTODOS PRIVADOS ─────────────────────────────────────────────────

  /**
   * Consulta el endpoint para cargar las opciones del selector.
   * Soporta respuestas paginadas (con .results) y arrays directos.
   * Si formatoCustomLabel está definido, transforma el label de cada opción.
   * Después de cargar, evalúa si debe auto-seleccionar el primer valor.
   */
  private _cargarDatos(): void {
    if (!this.endpoint) {
      console.error('[SelectorComponent] No se ha definido un endpoint');
      return;
    }

    this.loading.set(true);
    this._generalService
      .consultaApi(this.endpoint, this.parametros)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (respuesta: any) => {
          let datos = respuesta.results ?? respuesta;

          if (!Array.isArray(datos)) {
            console.error('[SelectorComponent] La respuesta no es un array:', datos);
            datos = [];
          }

          if (this.formatoCustomLabel) {
            datos = datos.map((item: any) => ({
              ...item,
              [this.labelField]: this.formatoCustomLabel(item),
            }));
          }

          this.options.set(datos);
          this._sugerirPrimerValor();
          this._cdr.detectChanges();
        },
        error: (error) => {
          console.error('[SelectorComponent] Error al cargar datos:', error);
          this.options.set([]);
          this._cdr.detectChanges();
        }
      });
  }

  /**
   * Auto-selecciona el primer item de la lista.
   * Solo actúa cuando sugerirPrimerValor=true e isEdicion=false.
   * Emite el valor tanto al ControlValueAccessor como al Output selectionChange.
   */
  private _sugerirPrimerValor(): void {
    if (this.sugerirPrimerValor && !this.isEdicion) {
      const items = this.options();
      if (items.length) {
        const primerValor = items[0][this.valueField];
        this.value = primerValor;
        this.onChange(primerValor);
        this.selectionChange.emit(items[0]);

        if (this.control) {
          this.control.setValue(primerValor, { emitEvent: true });
        }
      }
    }
  }

  /**
   * Configura el pipeline de búsqueda server-side con debounce.
   * Solo se activa si searchField tiene valor.
   * Usa Subject + switchMap para cancelar búsquedas anteriores automáticamente.
   */
  private _configurarBusqueda(): void {
    if (!this.searchField) return;

    this._busquedaSubject
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
        tap(() => this.loading.set(true)),
        switchMap((valor) =>
          this._generalService
            .consultaApi(this.endpoint, {
              ...this.parametros,
              [this.searchField]: valor,
            })
            .pipe(finalize(() => this.loading.set(false)))
        )
      )
      .subscribe({
        next: (respuesta: any) => {
          let datos = respuesta.results ?? respuesta;

          if (this.formatoCustomLabel) {
            datos = datos.map((item: any) => ({
              ...item,
              [this.labelField]: this.formatoCustomLabel(item),
            }));
          }

          this.options.set(datos);
          this._cdr.detectChanges();
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }

  /**
   * Sincroniza el valor inicial del control reactivo con el valor interno del componente.
   * También se suscribe a cambios futuros del control para mantener sincronía.
   */
  private _inicializarControl(): void {
    if (!this.control) return;

    const valorInicial = this.control.value;
    if (valorInicial !== undefined && valorInicial !== null) {
      this.value = valorInicial;
    }

    this.control.valueChanges.subscribe((nuevoValor) => {
      this.value = nuevoValor;
      this._cdr.detectChanges();
    });
  }

  /**
   * Normaliza claves de error de Angular (ej: 'minlength' -> 'minLength')
   * para hacer match con el mapa de mensajes `errors` del Input.
   */
  private _normalizeErrorKey(key: string): string {
    const keyMap: { [key: string]: string } = {
      minlength: 'minLength',
      maxlength: 'maxLength',
      required: 'required',
      pattern: 'pattern',
      email: 'email',
    };
    return keyMap[key] || key;
  }
}
