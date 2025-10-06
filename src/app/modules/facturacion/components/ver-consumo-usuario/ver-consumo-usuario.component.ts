import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpService } from '@comun/services/http.service';
import { ConsumoUsuario } from '@modulos/facturacion/interfaces/consumo-usuario.interface';

@Component({
  selector: 'app-ver-consumo-usuario',
  standalone: true,
  imports: [DatePipe, DecimalPipe],
  templateUrl: './ver-consumo-usuario.component.html',
  styleUrl: './ver-consumo-usuario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerConsumoUsuarioComponent implements OnInit {
  @Input({ required: true }) movimientoSeleccionado!: any;

  private readonly _httpService = inject(HttpService);
  public consumos = signal<ConsumoUsuario | undefined>(undefined);


  ngOnInit(): void {
    this.consultarConsumo();
  }

  consultarConsumo() {
    this._httpService.post<ConsumoUsuario>(
      'contenedor/consumo/consulta-usuario-fecha/',
      {
        "usuario_id": this.movimientoSeleccionado.usuario_id,
        "fechaDesde": this.movimientoSeleccionado.fecha_desde_consumo,
        "fechaHasta": this.movimientoSeleccionado.fecha_hasta_consumo
    },
    ).subscribe((respuestaConsultaConsumo) => {
      this.consumos.set(respuestaConsultaConsumo);
    });
  }
}

