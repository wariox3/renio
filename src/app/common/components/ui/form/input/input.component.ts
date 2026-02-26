import { NgClass } from '@angular/common';
import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Componente de input reutilizable que implementa ControlValueAccessor
 * para integración con Reactive Forms y Template-driven Forms.
 *
 * Maneja internamente la visualización de errores de validación,
 * normalizando las claves de error de Angular (ej: minlength -> minLength).
 *
 * @example
 * // Uso básico con Reactive Forms
 * <app-input
 *   type="email"
 *   placeholder="john@example.com"
 *   formControlName="email"
 *   [control]="form.controls['email']"
 *   [errors]="{
 *     required: ('VALIDACIONES.REQUERIDO' | translate),
 *     pattern: ('VALIDACIONES.EMAIL_INVALIDO' | translate),
 *   }"
 * ></app-input>
 */
@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgClass, TranslateModule],
  template: `
    <div>
      @if (labelTranslate || label) {
        <label class="form-label">
          @if (labelTranslate) {
            <span [translate]="labelTranslate"></span>
          } @else {
            {{ label }}
          }
        </label>
      }
      <input
        [type]="type"
        [placeholder]="placeholder"
        [value]="value()"
        (input)="onInput($event)"
        (blur)="onBlur()"
        [disabled]="disabled"
        [readonly]="readonly"
        [autofocus]="autofocus"
        [autocomplete]="autocomplete"
        [ngClass]="inputClass"
        class="form-control"
        #inputEl
      />
      @if (shouldShowErrors()) {
        @for (error of getErrors(); track $index) {
          <p class="text-danger">{{ error }}</p>
        }
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  /** Etiqueta del input (texto plano) */
  @Input() label: string = '';
  /** Clave de traducción para la etiqueta (tiene prioridad sobre label) */
  @Input() labelTranslate?: string;
  /** Texto placeholder del input */
  @Input() placeholder: string = '';
  /** Tipo de input HTML: text, email, password, number, etc. */
  @Input() type: string = 'text';
  /** Atributo autocomplete del input */
  @Input() autocomplete: string = 'off';
  /** Mapa de errores: clave del validador -> mensaje a mostrar */
  @Input() errors: { [key: string]: string } = {};
  /** Deshabilitar el input */
  @Input() disabled: boolean = false;
  /** Input de solo lectura */
  @Input() readonly: boolean = false;
  /** Hacer focus automático al renderizar */
  @Input() autofocus: boolean = false;
  /** Clases CSS adicionales para el elemento input */
  @Input() inputClass: string | string[] | Set<string> | { [klass: string]: any } = '';
  /** Estado inválido manual (alternativa a pasar [control]) */
  @Input() invalid: boolean | undefined = false;
  /** Estado dirty manual (alternativa a pasar [control]) */
  @Input() dirty: boolean | undefined = false;
  /** Estado touched manual (alternativa a pasar [control]) */
  @Input() touched: boolean | undefined = false;
  /** Referencia al AbstractControl del formulario reactivo para validación automática */
  @Input() control: AbstractControl | null = null;

  /** Evento emitido cuando el input pierde el foco */
  @Output() blurEvent = new EventEmitter<void>();

  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>;

  value = signal('');

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.value.set(inputValue);
    this.onChange(inputValue);
  }

  onBlur(): void {
    this.onTouched();
    this.blurEvent.emit();
  }

  /** Hace focus en el elemento input nativo */
  focus(): void {
    this.inputEl.nativeElement.focus();
  }

  /** Selecciona el texto del input */
  select(): void {
    this.inputEl.nativeElement.select();
  }

  shouldShowErrors(): boolean {
    if (this.control) {
      return this.control.invalid && (this.control.dirty || this.control.touched);
    }
    return this.invalid === true && (this.dirty === true || this.touched === true);
  }

  getErrors(): string[] {
    if (!this.errors) return [];

    if (this.control?.errors) {
      return Object.keys(this.control.errors)
        .map(errorKey => this.errors[this.normalizeErrorKey(errorKey)])
        .filter(Boolean);
    }

    if (this.invalid) {
      return Object.values(this.errors);
    }

    return [];
  }

  /** Normaliza claves de error de Angular (minlength -> minLength) */
  private normalizeErrorKey(key: string): string {
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
