import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-boton-guardar',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './boton-guardar.component.html',
  styleUrl: './boton-guardar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotonGuardarComponent {
  @Input({ required: true }) estaCargando: boolean | null = false;
  @Output() emitirGuardar: EventEmitter<void> = new EventEmitter<void>();

  guardar() {
    this.emitirGuardar.emit();
  }
}
