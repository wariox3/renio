import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comun-btn-exportar',
  standalone: true,
  imports: [TranslateModule, NgbDropdownModule],
  templateUrl: './btn-exportar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BtnExportarComponent {

  @Input() visualizarBtnExportarExcel = true
  @Input() visualizarBtnExportarZip = false

  @Output() emitirExportarExcel: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  @Output() emitirExportarZip: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  exportarExcel() {
    this.emitirExportarExcel.emit(true);
  }

  exportarZip(){
    this.emitirExportarZip.emit(true);
  }
}
