import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSoloNumeros]',
  standalone: true,
})
export class SoloNumerosDirective {
  private _integerRegex: RegExp = new RegExp(/^[0-9]*$/);
  private _decimalRegex: RegExp = new RegExp(/^[0-9]*\.?([0-9]{0,2})?$/);

  @Input('appSoloNumeros') appSoloNumeros: any;
  @Input('permiteDecimales') permiteDecimales: boolean = false; // Valor predeterminado es false
  @Input('CantidadDecimalesPerimitidos')
  cantidadDecimalesPerimitidos: number = 0; // Valor predeterminado es false

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    if (this.appSoloNumeros === false) {
      return input.value;
    } else {
      const regex = this.permiteDecimales
        ? this._decimalRegex
        : this._integerRegex;

      if (!regex.test(input.value)) {
        const words = input.value.split('.');
        if (this.permiteDecimales) {
          input.value = `${words[0]}.${words[1].slice(0, 2)}`;
          if (this.cantidadDecimalesPerimitidos > 0) {
            input.value = `${words[0]}.${words[1].slice(
              0,
              this.cantidadDecimalesPerimitidos
            )}`;
          }

          input.value = input.value.replace(
            this.permiteDecimales ? /[^0-9.]/g : /[^0-9]/g,
            ''
          );
        } else {
          input.value = input.value.replace(
            this.permiteDecimales ? /[^0-9.]/g : /[^0-9]/g,
            ''
          );
        }
      }
    }
  }
}
