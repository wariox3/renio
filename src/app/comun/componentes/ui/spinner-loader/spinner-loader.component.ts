import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner-loader',
  standalone: true,
  imports: [],
  template: `@if (mostrarCargando) {
    <div class="backdrop d-flex flex-column gap-1">
      <div class="spinner"></div>
      <p class="text-white fw-bold">Cargando</p>
    </div>

    } `,
  styleUrl: './spinner-loader.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerLoaderComponent {
  @Input() mostrarCargando: boolean | null = true;
}
