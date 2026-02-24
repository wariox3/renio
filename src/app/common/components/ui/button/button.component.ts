import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() text = '';
  @Input() translateKey = '';
  @Input() loadingText = '';
  @Input() loadingTranslateKey = '';
  @Input() type: 'submit' | 'button' | 'reset' = 'button';
  @Input() color:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() isLoading = false;
  @Input() isDisabled = false;
  @Input() iconLeft = '';
  @Input() iconRight = '';
  @Input() iconOnly = false;
  @Input() rounded = false;
  @Input() outline = false;
  @Input() block = false;
  @Input() customClasses = '';
  @Input() title = ''
  @Output() buttonClick = new EventEmitter<void>();

  handleClick() {
    this.buttonClick.emit();
  }

  /** ✅ Computa las clases dinámicamente */
  get computedClasses() {
    return {
      [`btn-${this.color}`]: !this.outline,
      [`btn-outline-${this.color}`]: this.outline,
      'btn-sm': this.size === 'sm',
      'btn-lg': this.size === 'lg',
      'rounded-pill': this.rounded,
      'w-100': this.block,
      'btn-icon': this.iconOnly,
      [this.customClasses]: !!this.customClasses, // permite clases personalizadas externas
    };
  }
}
