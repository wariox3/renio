import { Injectable } from '@angular/core';
import {
  DocumentoFactura,
  DocumentoFacturaDetalleRespuesta,
} from '@interfaces/comunes/factura/factura.interface';

@Injectable({
  providedIn: 'root',
})
export class OperacionesService {
  constructor() {}

  calcularSubtotal(cantiad: number, precio: number): number {
    return this.redondear(cantiad * precio, 2);
  }

  calcularBase(subtotal: number, porcentajeBase: number): number {
    return this.redondear((subtotal * porcentajeBase) / 100, 2);
  }

  calcularImpuesto(base: number, porcentaje: number): number {
    return this.redondear((base * porcentaje) / 100, 2);
  }

  calcularImpuestoOperado(impuestoCalculado: number, operacion: number) {
    return this.redondear(impuestoCalculado * operacion, 2);
  }

  sumarTotales(
    detalle: DocumentoFacturaDetalleRespuesta[],
    llave:
      | 'total'
      | 'subtotal'
      | 'impuesto_operado'
      | 'base_impuesto'
      | 'cantidad'
      | 'total_bruto'
  ) {
    return this.redondear(
      detalle.reduce((acc, curVal) => {
        return acc + curVal[llave];
      }, 0),
      2
    );
  }

  calcularTotal(subtotal: number, impuestoTotal: number) {
    return this.redondear(subtotal + impuestoTotal, 2);
  }

  redondear(valor: number, decimales: number): number {
    const factor = Math.pow(10, decimales);
    return Math.round(valor * factor) / factor;
  }
}
