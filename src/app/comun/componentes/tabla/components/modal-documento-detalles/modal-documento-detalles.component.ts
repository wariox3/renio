import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { PaginadorComponent } from '../../../paginador/paginador.component';
import { ModalDocumentoDetallesService } from '../../services/modal-documento-detalles.service';
import { GenDocumentoDetalle } from '@interfaces/general/documento-detalle.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-documento-detalles',
  standalone: true,
  imports: [PaginadorComponent, CommonModule],
  templateUrl: './modal-documento-detalles.component.html',
  styleUrl: './modal-documento-detalles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDocumentoDetallesComponent implements OnInit {
  private _documentoDetallesService = inject(ModalDocumentoDetallesService);
  public documentoDetalles = signal<GenDocumentoDetalle[]>([]);
  public cantidadRegistros = this._documentoDetallesService.cantidadRegistros;

  @Input({ required: true }) documentoId: number;

  ngOnInit(): void {
    this._documentoDetallesService.initParametrosConsulta(this.documentoId);
    this.getLista();
  }

  getLista() {
    this._documentoDetallesService.consultarLista().subscribe((response) => {
      this.documentoDetalles.set(response.registros);
    });
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this._documentoDetallesService.cambiarDesplazamiento(desplazamiento);
    this.getLista();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this._documentoDetallesService.actualizarPaginacion(data);
    this.getLista();
  }
}
