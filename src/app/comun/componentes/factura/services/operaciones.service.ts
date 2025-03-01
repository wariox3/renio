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

  calcularDescuento(subtotal: number, porcentajeDescuento: number) {
    return this.redondear((subtotal * porcentajeDescuento) / 100, 2);
  }

  sumarTotales(
    detalle: DocumentoFacturaDetalleRespuesta[],
    llave:
      | 'total'
      | 'subtotal'
      | 'impuesto_operado'
      | 'impuesto'
      | 'impuesto_retencion'
      | 'base_impuesto'
      | 'cantidad'
      | 'total_bruto'
      | 'descuento'
      | 'precio'
  ) {
    return this.redondear(
      detalle.reduce((acc, curVal) => {
        return acc + curVal[llave];
      }, 0),
      2,
    );
  }

  sumarSubtotal(detalle: DocumentoFacturaDetalleRespuesta[]) {
    const detallesFiltrados = detalle.filter(
      (detail) => detail.tipo_registro === 'I',
    );

    return this.redondear(
      detallesFiltrados.reduce((acc, curVal) => {
        return acc + curVal['subtotal'];
      }, 0),
      2,
    );
  }

  sumarTotal(detalle: DocumentoFacturaDetalleRespuesta[]) {
    let total = 0;

    detalle.forEach((detail) => {
      if (detail?.naturaleza === 'C') {
        total -= detail.total;
      } else {
        total += detail.total;
      }
    });

    return this.redondear(total, 2);
  }

  sumarTotalCuenta(detalle: DocumentoFacturaDetalleRespuesta[]): {
    debitos: number;
    creditos: number;
  } {
    let debitos = 0;
    let creditos = 0;

    const detallesTipoCuenta = detalle.filter(
      (detalil) => detalil.tipo_registro === 'C',
    );

    detallesTipoCuenta.forEach((detail) => {
      if (detail.naturaleza === 'C') {
        creditos += detail.total;
      } else {
        debitos += detail.total;
      }
    });

    return {
      debitos: this.redondear(debitos, 2),
      creditos: this.redondear(creditos, 2),
    };
  }

  calcularTotal(subtotal: number, impuestoTotal: number) {
    return this.redondear(subtotal + impuestoTotal, 2);
  }

  redondear(valor: number, decimales: number): number {
    const factor = Math.pow(10, decimales);
    return Math.round(valor * factor) / factor;
  }
}
