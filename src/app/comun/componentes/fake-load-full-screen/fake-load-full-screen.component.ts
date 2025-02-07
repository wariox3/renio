import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-fake-load-full-screen',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './fake-load-full-screen.component.html',
  styleUrls: ['./fake-load-full-screen.component.scss'],
})
export class FakeLoadFullScreenComponent {
  @Input() procesando: boolean;
  @Input() mensaje: string;
}
