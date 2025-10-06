import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralService } from '@comun/services/general.service';
import { Documento, DocumentoDetalle } from '@modulos/humano/interfaces/aporte';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-ver-contrato-documento-detalles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ver-contrato-documento-detalles.component.html',
  styleUrl: './ver-contrato-documento-detalles.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerContratoDocumentoDetallesComponent implements OnInit { 
  @Input() contrato: any;
  @Input() fechaInicio: any;
  @Input() fechaFin: any;

  private _generalService = inject(GeneralService);
  public documento = signal<Documento[]>([]);
  public documentoDetalles = signal<DocumentoDetalle[]>([]);

  ngOnInit(): void {
    this.consultarDocumento();
    this.consultarDetallesDocumento();
  }

  consultarDetallesDocumento(){
    this._generalService.consultaApi<RespuestaApi<DocumentoDetalle>>("general/documento_detalle/", {
      serializador: "nomina",
      documento__documento_tipo__documento_clase_id: 701,
      documento__contrato_id: this.contrato.contrato,
      documento__fecha__gte: this.fechaInicio,
      documento__fecha__lte: this.fechaFin,
    } ).subscribe((res) => {
      this.documentoDetalles.set(res.results);
    });
  }

  consultarDocumento () {
    this._generalService.consultaApi<RespuestaApi<Documento>>("general/documento/", {
      serializador: "lista_nomina",
    } ).subscribe((res) => {
      this.documento.set(res.results);
    });
  }
}
