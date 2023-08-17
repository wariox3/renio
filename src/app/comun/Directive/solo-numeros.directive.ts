import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSoloNumeros]',
  standalone: true
})
export class SoloNumerosDirective {

  private regex: RegExp = new RegExp(/^[0-9]*$/);

  constructor() { }

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (!this.regex.test(value)) {
      input.value = value.replace(/[^0-9]/g, '');
    }
  }
}
