import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarConMetodoDepreciacion } from '@interfaces/comunes/autocompletar/contabilidad/con-metodo-depreciacion.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-seleccionar-metodo-depreciacion',
  standalone: true,
  imports: [TranslateModule, FormsModule, NgClass],
  templateUrl: './seleccionar-metodo-depreciacion.component.html',
  styleUrl: './seleccionar-metodo-depreciacion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeleccionarMetodoDepreciacionComponent
  extends General
  implements OnInit
{
  private readonly _generalService = inject(GeneralService);
  public tipoCostos = signal<RegistroAutocompletarConMetodoDepreciacion[]>([]);

  @Output() selectChange = new EventEmitter<number>();
  @Input() valorInicial: number;
  @Input() grande: boolean = false;
  @Input() sugerirPrimerValor: boolean = false;
  @Input() isEdicion: boolean = false;
  @ViewChild('selectGrupo', { read: ElementRef })
  selectGrupo: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.getTipoCostos();
  }

  getTipoCostos() {
    this._generalService
      .consultaApi<RegistroAutocompletarConMetodoDepreciacion[]>(
        'contabilidad/metodo_depreciacion/seleccionar/',
        {
          limite: 100,
        },
      )
      .subscribe((response) => {
        this.tipoCostos.set(response);
        this._sugerirPrimerValor();
      });
  }

  private _sugerirPrimerValor() {
    if (this.sugerirPrimerValor && !this.isEdicion) {
      const grupos = this.tipoCostos();
      if (grupos.length) {
        this.selectChange.emit(grupos[0].id);
      }
    }
  }

  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = Number(selectElement.value); // Obtiene el valor seleccionado
    this.selectChange.emit(selectedValue); // Emite el valor al padre
  }
}
