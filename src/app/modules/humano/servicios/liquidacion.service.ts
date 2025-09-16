import { Injectable, signal } from '@angular/core';
import { Subdominio } from '@comun/clases/subdomino';
import { HttpService } from '@comun/services/http.service';
import { Liquidacion } from '../interfaces/liquidacion.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LiquidacionService extends Subdominio {

  liquidacionSignal = signal<Liquidacion>({
    id: 0,
    fecha: '',
    contrato__contacto__numero_identificacion: '',
    contrato__contacto__nombre_corto: '',
    contrato__salario: 0,
    contrato_id: 0,
    fecha_desde: '',
    fecha_hasta: '',
    total: 0,
    dias: 0,
    dias_cesantia: 0,
    dias_prima: 0,
    dias_vacacion: 0,
    fecha_ultimo_pago: null,
    fecha_ultimo_pago_prima: null,
    fecha_ultimo_pago_cesantia: null,
    fecha_ultimo_pago_vacacion: null,
    cesantia: 0,
    interes: 0,
    prima: 0,
    vacacion: 0,
    deduccion: 0,
    adicion: 0,
    estado_generado: false,
    estado_aprobado: false,
    comentario: undefined
  })

  constructor(private httpService: HttpService) {
    super();
  }

  getLiquidacionPorId(id: number) {
    return this.httpService.getDetalle<Liquidacion>(
      `humano/liquidacion/${id}/?serializador=detalle`,
    )
      .pipe(
        tap((respuesta) => {
          this.liquidacionSignal.set(respuesta)
        }))
  }

  aprobar(id: number) {
    return this.httpService.post(`humano/liquidacion/aprobar/`, { id });
  }

  generar(id: number) {
    return this.httpService.post<any>(`humano/liquidacion/generar/`, { id });
  }

  desgenerar(id: number) {
    return this.httpService.post<any>(`humano/liquidacion/desgenerar/`, { id });
  }

  desaprobar(id: number) {
    return this.httpService.post<any>(`humano/liquidacion/desaprobar/`, { id });
  }

  reliquiar(id: number) {
    return this.httpService.post<any>(`humano/liquidacion/reliquidar/`, { id });
  }
}
