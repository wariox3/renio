import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { GenDocumentoDetalle } from '@interfaces/general/documento-detalle.interface';
import { PaginadorComponent } from '../../../paginador/paginador.component';
import { ModalDocumentoReferenciaService } from '../../services/modal-documento-referencia.service';

@Component({
  selector: 'app-modal-documento-referencia',
  standalone: true,
  imports: [PaginadorComponent, CommonModule],
  templateUrl: './modal-documento-referencia.component.html',
  styleUrl: './modal-documento-referencia.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDocumentoReferenciaComponent implements OnInit {
  private _documentoDetallesService = inject(ModalDocumentoReferenciaService);
  public documentoDetalles = signal<GenDocumentoDetalle[]>([]);
  public cantidadRegistros = this._documentoDetallesService.cantidadRegistros;

  @Input({ required: true }) documento: GenDocumentoDetalle;

  ngOnInit(): void {
    this._documentoDetallesService.initParametrosConsulta(this.documento.id);
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
