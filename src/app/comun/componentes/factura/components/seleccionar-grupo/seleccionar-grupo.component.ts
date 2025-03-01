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
import { RegistroAutocompletarConGrupo } from '@interfaces/comunes/autocompletar/contabilidad/con-grupo.interface';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-seleccionar-grupo',
  standalone: true,
  imports: [TranslateModule, FormsModule, NgClass],
  templateUrl: './seleccionar-grupo.component.html',
  styleUrl: './seleccionar-grupo.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeleccionarGrupoComponent extends General implements OnInit {
  private readonly _generalService = inject(GeneralService);
  public grupos = signal<RegistroAutocompletarConGrupo[]>([]);

  @Output() selectChange = new EventEmitter<number>();
  @Input() valorInicial: number;
  @Input() grande: boolean = false;
  @Input() sugerirPrimerValor: boolean = false;
  @Input() isEdicion: boolean = false;
  @ViewChild('selectGrupo', { read: ElementRef })
  selectGrupo: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.getGrupos();
  }

  getGrupos() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarConGrupo>({
        limite: 10,
        desplazar: 0,
        ordenamientos: [],
        limite_conteo: 10000,
        modelo: 'ConGrupo',
        serializador: 'ListaAutocompletar',
      })
      .subscribe((response) => {
        this.grupos.set(response.registros);
        this._sugerirPrimerValor();
      });
  }

  private _sugerirPrimerValor() {
    if (this.sugerirPrimerValor && !this.isEdicion) {
      const grupos = this.grupos();
      if (grupos.length) {
        this.selectChange.emit(grupos[0].grupo_id);
      }
    }
  }

  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = Number(selectElement.value); // Obtiene el valor seleccionado
    this.selectChange.emit(selectedValue); // Emite el valor al padre
  }
}
