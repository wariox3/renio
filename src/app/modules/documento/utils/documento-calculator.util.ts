import { GenDocumento } from '../interfaces/gen-documento.interface';
import { GenDocumentoDetalle } from '../interfaces/gen-documento-detalle.interface';
import { GenDocumentoImpuesto } from '../interfaces/gen-documento-impuesto.interface';

/**
 * Utilidad para cálculos relacionados con documentos
 * Contiene lógica de cálculo pura sin efectos secundarios
 */
export class DocumentoCalculator {
  /**
   * Calcula el subtotal de un detalle (cantidad * precio)
   */
  static calcularSubtotalDetalle(detalle: Partial<GenDocumentoDetalle>): number {
    const cantidad = detalle.cantidad || 0;
    const precio = detalle.precio || 0;
    return this.redondear(cantidad * precio);
  }

  /**
   * Calcula el descuento de un detalle
   */
  static calcularDescuentoDetalle(detalle: Partial<GenDocumentoDetalle>): number {
    const subtotal = this.calcularSubtotalDetalle(detalle);
    const porcentajeDescuento = detalle.porcentaje_descuento || 0;
    return this.redondear((subtotal * porcentajeDescuento) / 100);
  }

  /**
   * Calcula la base gravable de un detalle (subtotal - descuento)
   */
  static calcularBaseDetalle(detalle: Partial<GenDocumentoDetalle>): number {
    const subtotal = this.calcularSubtotalDetalle(detalle);
    const descuento = this.calcularDescuentoDetalle(detalle);
    return this.redondear(subtotal - descuento);
  }

  /**
   * Calcula el total de impuestos de un detalle
   */
  static calcularImpuestosDetalle(detalle: GenDocumentoDetalle): number {
    if (!detalle.impuestos || detalle.impuestos.length === 0) {
      return 0;
    }

    return this.redondear(
      detalle.impuestos.reduce((sum, impuesto) => sum + (impuesto.total || 0), 0)
    );
  }

  /**
   * Calcula el total de un detalle (base + impuestos)
   */
  static calcularTotalDetalle(detalle: GenDocumentoDetalle): number {
    const base = this.calcularBaseDetalle(detalle);
    const impuestos = this.calcularImpuestosDetalle(detalle);
    return this.redondear(base + impuestos);
  }

  /**
   * Calcula el subtotal de un documento (suma de subtotales de detalles)
   */
  static calcularSubtotalDocumento(detalles: GenDocumentoDetalle[]): number {
    if (!detalles || detalles.length === 0) return 0;

    return this.redondear(
      detalles.reduce(
        (sum, detalle) => sum + this.calcularSubtotalDetalle(detalle),
        0
      )
    );
  }

  /**
   * Calcula el descuento total de un documento
   */
  static calcularDescuentoDocumento(detalles: GenDocumentoDetalle[]): number {
    if (!detalles || detalles.length === 0) return 0;

    return this.redondear(
      detalles.reduce(
        (sum, detalle) => sum + this.calcularDescuentoDetalle(detalle),
        0
      )
    );
  }

  /**
   * Calcula la base gravable total del documento
   */
  static calcularBaseDocumento(detalles: GenDocumentoDetalle[]): number {
    if (!detalles || detalles.length === 0) return 0;

    return this.redondear(
      detalles.reduce(
        (sum, detalle) => sum + this.calcularBaseDetalle(detalle),
        0
      )
    );
  }

  /**
   * Calcula los impuestos totales del documento
   */
  static calcularImpuestosDocumento(detalles: GenDocumentoDetalle[]): number {
    if (!detalles || detalles.length === 0) return 0;

    return this.redondear(
      detalles.reduce(
        (sum, detalle) => sum + this.calcularImpuestosDetalle(detalle),
        0
      )
    );
  }

  /**
   * Calcula el total del documento
   */
  static calcularTotalDocumento(detalles: GenDocumentoDetalle[]): number {
    if (!detalles || detalles.length === 0) return 0;

    return this.redondear(
      detalles.reduce((sum, detalle) => sum + this.calcularTotalDetalle(detalle), 0)
    );
  }

  /**
   * Calcula el total bruto del documento (subtotal sin descuentos ni impuestos)
   */
  static calcularTotalBrutoDocumento(detalles: GenDocumentoDetalle[]): number {
    return this.calcularSubtotalDocumento(detalles);
  }

  /**
   * Calcula el saldo pendiente de un documento
   */
  static calcularPendiente(documento: GenDocumento): number {
    const total = documento.total || 0;
    const pago = documento.pago || 0;
    const afectado = documento.afectado || 0;
    return this.redondear(total - pago - afectado);
  }

  /**
   * Verifica si un documento está completamente pagado
   */
  static estaPagado(documento: GenDocumento): boolean {
    const pendiente = this.calcularPendiente(documento);
    return pendiente <= 0.01; // Tolerancia por redondeo
  }

  /**
   * Verifica si un documento tiene saldo pendiente
   */
  static tieneSaldoPendiente(documento: GenDocumento): boolean {
    return !this.estaPagado(documento);
  }

  /**
   * Calcula el porcentaje de pago de un documento
   */
  static calcularPorcentajePago(documento: GenDocumento): number {
    const total = documento.total || 0;
    if (total === 0) return 0;

    const pago = documento.pago || 0;
    const afectado = documento.afectado || 0;
    const pagado = pago + afectado;

    return this.redondear((pagado * 100) / total, 2);
  }

  /**
   * Agrupa impuestos por tipo en un documento
   */
  static agruparImpuestos(
    detalles: GenDocumentoDetalle[]
  ): Map<number, { nombre: string; total: number; base: number }> {
    const impuestosAgrupados = new Map<
      number,
      { nombre: string; total: number; base: number }
    >();

    if (!detalles || detalles.length === 0) return impuestosAgrupados;

    detalles.forEach((detalle) => {
      if (!detalle.impuestos) return;

      detalle.impuestos.forEach((impuesto) => {
        const impuestoId = impuesto.impuesto_id;
        const existente = impuestosAgrupados.get(impuestoId);

        if (existente) {
          existente.total += impuesto.total || 0;
          existente.base += impuesto.base || 0;
        } else {
          impuestosAgrupados.set(impuestoId, {
            nombre: impuesto.impuesto_nombre,
            total: impuesto.total || 0,
            base: impuesto.base || 0,
          });
        }
      });
    });

    // Redondear totales
    impuestosAgrupados.forEach((value) => {
      value.total = this.redondear(value.total);
      value.base = this.redondear(value.base);
    });

    return impuestosAgrupados;
  }

  /**
   * Calcula el impuesto de un detalle específico
   */
  static calcularImpuesto(
    base: number,
    porcentaje: number,
    porcentajeBase: number = 100
  ): number {
    const baseCalculada = (base * porcentajeBase) / 100;
    return this.redondear((baseCalculada * porcentaje) / 100);
  }

  /**
   * Redondea un número a 2 decimales (o los decimales especificados)
   */
  static redondear(valor: number, decimales: number = 2): number {
    const factor = Math.pow(10, decimales);
    return Math.round(valor * factor) / factor;
  }

  /**
   * Formatea un número como moneda
   */
  static formatearMoneda(
    valor: number,
    simbolo: string = '$',
    decimales: number = 2
  ): string {
    return `${simbolo} ${valor.toFixed(decimales).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  /**
   * Valida que los totales calculados coincidan con los del documento
   */
  static validarTotales(documento: GenDocumento): {
    valido: boolean;
    diferencias: { campo: string; calculado: number; documento: number }[];
  } {
    const diferencias: { campo: string; calculado: number; documento: number }[] =
      [];

    if (!documento.detalles || documento.detalles.length === 0) {
      return { valido: true, diferencias };
    }

    // Calcular totales
    const subtotalCalculado = this.calcularSubtotalDocumento(documento.detalles);
    const descuentoCalculado = this.calcularDescuentoDocumento(documento.detalles);
    const baseCalculada = this.calcularBaseDocumento(documento.detalles);
    const impuestosCalculados = this.calcularImpuestosDocumento(documento.detalles);
    const totalCalculado = this.calcularTotalDocumento(documento.detalles);

    // Validar diferencias (tolerancia de 0.01 por redondeo)
    const tolerancia = 0.01;

    if (Math.abs(documento.subtotal - subtotalCalculado) > tolerancia) {
      diferencias.push({
        campo: 'subtotal',
        calculado: subtotalCalculado,
        documento: documento.subtotal,
      });
    }

    if (Math.abs(documento.descuento - descuentoCalculado) > tolerancia) {
      diferencias.push({
        campo: 'descuento',
        calculado: descuentoCalculado,
        documento: documento.descuento,
      });
    }

    if (Math.abs(documento.base_impuesto - baseCalculada) > tolerancia) {
      diferencias.push({
        campo: 'base_impuesto',
        calculado: baseCalculada,
        documento: documento.base_impuesto,
      });
    }

    if (Math.abs(documento.impuesto - impuestosCalculados) > tolerancia) {
      diferencias.push({
        campo: 'impuesto',
        calculado: impuestosCalculados,
        documento: documento.impuesto,
      });
    }

    if (Math.abs(documento.total - totalCalculado) > tolerancia) {
      diferencias.push({
        campo: 'total',
        calculado: totalCalculado,
        documento: documento.total,
      });
    }

    return {
      valido: diferencias.length === 0,
      diferencias,
    };
  }
}
