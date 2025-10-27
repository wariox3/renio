import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-label',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LabelComponent {
  /** Texto del label (opcional si se usa ng-content) */
  @Input() text?: string;

  /** Indica si el campo es obligatorio */
  @Input() required = false;

  /** Asocia el label con un input mediante "for" */
  @Input() for?: string;

  /** Texto de ayuda o tooltip */
  @Input() tooltip?: string;

  /** Deshabilita visualmente el label */
  @Input() disabled = false;

  /** Clave de traducción (ngx-translate) */
  @Input() translate?: string;
}
