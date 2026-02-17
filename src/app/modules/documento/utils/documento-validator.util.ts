import { GenDocumento } from '../interfaces/gen-documento.interface';
import { GenDocumentoDetalle } from '../interfaces/gen-documento-detalle.interface';

/**
 * Resultado de una validación
 */
export interface ResultadoValidacion {
  valido: boolean;
  mensaje?: string;
  campo?: string;
}

/**
 * Utilidad para validaciones de documentos
 * Contiene lógica de validación pura sin efectos secundarios
 */
export class DocumentoValidator {
  /**
   * Valida que un ID sea válido (número positivo entero)
   */
  static validarId(id: number): boolean {
    return id > 0 && Number.isInteger(id);
  }

  /**
   * Valida que una fecha sea válida
   */
  static validarFecha(fecha: string): boolean {
    if (!fecha) return false;
    const date = new Date(fecha);
    return !isNaN(date.getTime());
  }

  /**
   * Valida que un arreglo de detalles sea válido
   */
  static validarDetalles(detalles: GenDocumentoDetalle[] | undefined): boolean {
    return Array.isArray(detalles) && detalles.length > 0;
  }

  /**
   * Valida que un monto sea válido (número no negativo)
   */
  static validarMonto(monto: number): boolean {
    return typeof monto === 'number' && monto >= 0 && !isNaN(monto);
  }

  /**
   * Valida si un documento puede ser aprobado
   */
  static puedeAprobar(documento: GenDocumento): ResultadoValidacion {
    if (documento.estado_aprobado) {
      return {
        valido: false,
        mensaje: 'El documento ya está aprobado',
        campo: 'estado_aprobado',
      };
    }

    if (documento.estado_anulado) {
      return {
        valido: false,
        mensaje: 'No se puede aprobar un documento anulado',
        campo: 'estado_anulado',
      };
    }

    if (!this.validarDetalles(documento.detalles)) {
      return {
        valido: false,
        mensaje: 'El documento debe tener al menos un detalle',
        campo: 'detalles',
      };
    }

    if (!documento.contacto_id) {
      return {
        valido: false,
        mensaje: 'El documento debe tener un contacto',
        campo: 'contacto_id',
      };
    }

    return { valido: true };
  }

  /**
   * Valida si un documento puede ser emitido electrónicamente
   */
  static puedeEmitir(documento: GenDocumento): ResultadoValidacion {
    if (!documento.estado_aprobado) {
      return {
        valido: false,
        mensaje: 'El documento debe estar aprobado antes de emitir',
        campo: 'estado_aprobado',
      };
    }

    if (documento.estado_anulado) {
      return {
        valido: false,
        mensaje: 'No se puede emitir un documento anulado',
        campo: 'estado_anulado',
      };
    }

    if (documento.estado_electronico) {
      return {
        valido: false,
        mensaje: 'El documento ya ha sido emitido electrónicamente',
        campo: 'estado_electronico',
      };
    }

    return { valido: true };
  }

  /**
   * Valida si un documento puede ser anulado
   */
  static puedeAnular(documento: GenDocumento): ResultadoValidacion {
    if (documento.estado_anulado) {
      return {
        valido: false,
        mensaje: 'El documento ya está anulado',
        campo: 'estado_anulado',
      };
    }

    if (documento.estado_contabilizado) {
      return {
        valido: false,
        mensaje: 'No se puede anular un documento contabilizado',
        campo: 'estado_contabilizado',
      };
    }

    return { valido: true };
  }

  /**
   * Valida si un documento puede ser eliminado
   */
  static puedeEliminar(documento: GenDocumento): ResultadoValidacion {
    if (documento.estado_aprobado) {
      return {
        valido: false,
        mensaje: 'No se puede eliminar un documento aprobado',
        campo: 'estado_aprobado',
      };
    }

    if (documento.estado_electronico) {
      return {
        valido: false,
        mensaje: 'No se puede eliminar un documento electrónico',
        campo: 'estado_electronico',
      };
    }

    if (documento.estado_contabilizado) {
      return {
        valido: false,
        mensaje: 'No se puede eliminar un documento contabilizado',
        campo: 'estado_contabilizado',
      };
    }

    return { valido: true };
  }

  /**
   * Valida si un documento puede ser editado
   */
  static puedeEditar(documento: GenDocumento): ResultadoValidacion {
    if (documento.estado_aprobado) {
      return {
        valido: false,
        mensaje: 'No se puede editar un documento aprobado',
        campo: 'estado_aprobado',
      };
    }

    if (documento.estado_anulado) {
      return {
        valido: false,
        mensaje: 'No se puede editar un documento anulado',
        campo: 'estado_anulado',
      };
    }

    if (documento.estado_electronico) {
      return {
        valido: false,
        mensaje: 'No se puede editar un documento electrónico',
        campo: 'estado_electronico',
      };
    }

    return { valido: true };
  }

  /**
   * Valida que un detalle de documento sea válido
   */
  static validarDetalle(detalle: Partial<GenDocumentoDetalle>): ResultadoValidacion {
    if (!detalle.cantidad || detalle.cantidad <= 0) {
      return {
        valido: false,
        mensaje: 'La cantidad debe ser mayor a cero',
        campo: 'cantidad',
      };
    }

    if (!detalle.precio || detalle.precio < 0) {
      return {
        valido: false,
        mensaje: 'El precio no puede ser negativo',
        campo: 'precio',
      };
    }

    if (!detalle.item && !detalle.cuenta && !detalle.concepto_id) {
      return {
        valido: false,
        mensaje: 'El detalle debe tener un item, cuenta o concepto',
        campo: 'item',
      };
    }

    return { valido: true };
  }

  /**
   * Valida un rango de fechas
   */
  static validarRangoFechas(
    fechaDesde: string,
    fechaHasta: string
  ): ResultadoValidacion {
    if (!this.validarFecha(fechaDesde)) {
      return {
        valido: false,
        mensaje: 'La fecha inicial no es válida',
        campo: 'fecha_desde',
      };
    }

    if (!this.validarFecha(fechaHasta)) {
      return {
        valido: false,
        mensaje: 'La fecha final no es válida',
        campo: 'fecha_hasta',
      };
    }

    const desde = new Date(fechaDesde);
    const hasta = new Date(fechaHasta);

    if (desde > hasta) {
      return {
        valido: false,
        mensaje: 'La fecha inicial no puede ser mayor a la fecha final',
        campo: 'fecha_desde',
      };
    }

    return { valido: true };
  }

  /**
   * Valida que el total del documento coincida con la suma de detalles
   */
  static validarTotales(documento: GenDocumento): ResultadoValidacion {
    if (!documento.detalles || documento.detalles.length === 0) {
      return { valido: true }; // No hay detalles para validar
    }

    const totalDetalles = documento.detalles.reduce(
      (sum, detalle) => sum + (detalle.total || 0),
      0
    );

    // Permitir una diferencia mínima por redondeo (0.01)
    const diferencia = Math.abs(documento.total - totalDetalles);
    if (diferencia > 0.01) {
      return {
        valido: false,
        mensaje: `El total del documento (${documento.total}) no coincide con la suma de detalles (${totalDetalles})`,
        campo: 'total',
      };
    }

    return { valido: true };
  }

  /**
   * Valida que un documento tenga todos los campos requeridos para guardarlo
   */
  static validarDocumentoCompleto(
    documento: Partial<GenDocumento>
  ): ResultadoValidacion {
    if (!documento.contacto_id) {
      return {
        valido: false,
        mensaje: 'Debe seleccionar un contacto',
        campo: 'contacto_id',
      };
    }

    if (!documento.documento_tipo_id) {
      return {
        valido: false,
        mensaje: 'Debe especificar el tipo de documento',
        campo: 'documento_tipo_id',
      };
    }

    if (!documento.fecha) {
      return {
        valido: false,
        mensaje: 'Debe especificar la fecha del documento',
        campo: 'fecha',
      };
    }

    if (!this.validarFecha(documento.fecha)) {
      return {
        valido: false,
        mensaje: 'La fecha del documento no es válida',
        campo: 'fecha',
      };
    }

    if (!this.validarDetalles(documento.detalles)) {
      return {
        valido: false,
        mensaje: 'El documento debe tener al menos un detalle',
        campo: 'detalles',
      };
    }

    return { valido: true };
  }
}
