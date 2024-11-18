import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comun-btn-anular',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <button
      type="button"
      class="btn btn-sm btn-danger rounded-0"
      (click)="anular()"
      [disabled]="btnDisable"
    >
      {{ 'FORMULARIOS.BOTONES.COMUNES.ANULAR' | translate }}
    </button>
  `,
})
export class BtnAnularComponent {
  @Input({ required: true }) btnDisable: boolean;
  @Output() emitirAnular: EventEmitter<void> = new EventEmitter<void>();

  anular(){
    this.emitirAnular.emit();

  }
}
