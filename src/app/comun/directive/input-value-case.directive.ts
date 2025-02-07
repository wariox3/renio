import {
  Directive,
  ElementRef,
  Renderer2,
  OnInit,
  HostListener,
  forwardRef,
  Input,
  inject,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

/**
 * Directiva Angular para transformar el texto de un input a mayúsculas o minúsculas.
 * Esta directiva implementa la interfaz ControlValueAccessor para integrarse con formularios de Angular.

 * <input type="text" appInputValueLowercase appInputValueCase="mayuscula">
 * <input type="text" appInputValueLowercase appInputValueCase="minuscula">
 *
 */
@Directive({
  selector: '[appInputValuecaseDirective]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR, // Proporciona la directiva como un ControlValueAccessor.
      useExisting: forwardRef(() => InputValueCaseDirective), // Evita errores de dependencia circular.
      multi: true, // Permite múltiples implementaciones de ControlValueAccessor.
    },
  ],
})
export class InputValueCaseDirective implements OnInit, ControlValueAccessor {
  /**
   * Input para configurar si el texto se muestra en minúsculas o mayúsculas.
   * Valores posibles: 'minuscula' | 'mayuscula'.
   * Valor por defecto: 'minuscula'.
   */
  @Input() appInputValueCase: 'minuscula' | 'mayuscula' = 'minuscula';

  /**
   * Función que se llama cuando el valor del input cambia.
   * Se utiliza para comunicar los cambios al formulario.
   */
  onChange: any = () => {};

  /**
   * Función que se llama cuando el input pierde el foco (blur).
   * Se utiliza para indicar que el usuario ha interactuado con el input.
   */
  onTouched: any = () => {};

  /**
   * Inyección de dependencia del elemento HTML donde se aplica la directiva.
   */
  private _el = inject(ElementRef);

  /**
   * Inyección de dependencia del renderizador para manipular el DOM.
   */
  private _renderer = inject(Renderer2);

  /**
   * Se llama cuando se inicializa la directiva.
   */
  ngOnInit() {
    this._aplicarTransformacion(); // Aplica la transformación inicial al cargar el componente.
  }

  /**
   * Aplica la transformación CSS (mayúsculas o minúsculas) al input.
   */
  private _aplicarTransformacion() {
    const transformValue =
      this.appInputValueCase === 'minuscula' ? 'lowercase' : 'uppercase'; // Determina la transformación a aplicar según el input appInputValueCase.
    this._renderer.setStyle(
      this._el.nativeElement,
      'text-transform',
      transformValue
    ); // Aplica la transformación CSS al input.  Esto solo afecta la visualización.
  }

  /**
   * Escucha el evento 'input' del input (cuando el usuario escribe).
   */
  @HostListener('input', ['$event.target.value'])
  onInputChange(valor: string) {
    const valorFormateado =
      this.appInputValueCase === 'minuscula'
        ? valor.toLowerCase()
        : valor.toUpperCase(); // Transforma el valor del input a minúsculas o mayúsculas.

    // Actualizar el valor del formulario.  Esta es la parte crucial para que el formulario funcione correctamente.
    this.onChange(valorFormateado); // Llama a la función onChange para comunicar el cambio al formulario.
  }

  /**
   * Escucha el evento 'blur' del input (cuando pierde el foco).
   */
  @HostListener('blur')
  onBlur() {
    this.onTouched(); // Llama a la función onTouched para indicar que el input ha sido "tocado".
  }

  /**
   * Función llamada por Angular para establecer el valor del input desde el formulario.
   * @param valor El valor que se va a establecer en el input.
   */
  writeValue(valor: any): void {
    if (valor) {
      const valorFormateado =
        this.appInputValueCase === 'minuscula'
          ? valor.toLowerCase()
          : valor.toUpperCase(); // Transforma el valor a minúsculas o mayúsculas.
      this._renderer.setProperty(this._el.nativeElement, 'value', valorFormateado); // Establece el valor formateado en el input.
    } else {
      this._renderer.setProperty(this._el.nativeElement, 'value', ''); // Limpia el input si el valor es null o undefined.
    }
  }

  /**
   * Función llamada por Angular para registrar la función que se llama cuando el valor del input cambia.
   * @param fn La función que se va a llamar cuando el valor del input cambia.
   */
  registerOnChange(fn: any): void {
    this.onChange = fn; // Guarda la función onChange para usarla en onInputChange.
  }

  /**
   * Función llamada por Angular para registrar la función que se llama cuando el input pierde el foco.
   * @param fn La función que se va a llamar cuando el input pierde el foco.
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn; // Guarda la función onTouched para usarla en onBlur.
  }

  /**
   * Función llamada por Angular para habilitar o deshabilitar el input.
   * @param isDisabled Indica si el input está deshabilitado.
   */
  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._el.nativeElement, 'disabled', isDisabled); // Establece el estado disabled del input.
  }
}
