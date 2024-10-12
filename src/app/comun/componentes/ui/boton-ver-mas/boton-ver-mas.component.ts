import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { KeeniconComponent } from 'src/app/_metronic/shared/keenicon/keenicon.component';

@Component({
  selector: 'app-boton-ver-mas',
  standalone: true,
  imports: [
    KeeniconComponent,
    CommonModule,
  ],
  templateUrl: './boton-ver-mas.component.html',
  styleUrl: './boton-ver-mas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BotonVerMasComponent { 
  @Input() expandido?: boolean = false
  @Output() toggle = new EventEmitter<boolean>()

  onClick() {
    this.expandido = !this.expandido
    this.toggle.emit(this.expandido)
  }
}
