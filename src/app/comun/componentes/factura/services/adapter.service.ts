import { Injectable } from '@angular/core';
import {
  DocumentoDetalleFactura,
  DocumentoImpuestoFacturaRespuesta,
  ImpuestoFormulario,
  ImpuestoRespuestaConsulta,
  RespuestaAgregarDocumentoItem,
} from '@interfaces/comunes/factura/factura.interface';

@Injectable({
  providedIn: 'root',
})
export class AdapterService {
  constructor() {}

  adaptarImpuesto(
    impuesto: ImpuestoRespuestaConsulta,
    modoEdicion: boolean,
    nuller: boolean = false
  ): ImpuestoFormulario {
    return {
      id: impuesto.id && modoEdicion && !nuller ? impuesto.id : null,
      impuesto: impuesto.impuesto_id,
      porcentaje: impuesto.impuesto_porcentaje,
      total: 0,
      total_operado: 0,
      nombre: impuesto.impuesto_nombre,
      nombre_extendido: impuesto.impuesto_nombre_extendido,
      impuesto_id: impuesto.impuesto_id,
      impuesto_nombre_extendido: impuesto.impuesto_nombre_extendido,
      impuesto_nombre: impuesto.impuesto_nombre,
      porcentaje_base: impuesto.impuesto_porcentaje_base,
      impuesto_venta: impuesto.impuesto_venta,
      impuesto_compra: impuesto.impuesto_compra,
      impuesto_operacion: impuesto.impuesto_operacion,
    };
  }

  adaptarImpuestoParaSelector(
    impuesto: ImpuestoFormulario
  ): ImpuestoRespuestaConsulta {
    return {
      id: impuesto.id ? impuesto.id : null,
      impuesto_id: impuesto.impuesto_id,
      impuesto_nombre: impuesto.impuesto_nombre,
      impuesto_nombre_extendido: impuesto.impuesto_nombre_extendido,
      impuesto_porcentaje: impuesto.porcentaje,
      impuesto_porcentaje_base: impuesto.porcentaje_base,
      impuesto_venta: impuesto.impuesto_venta,
      impuesto_compra: impuesto.impuesto_compra,
      impuesto_operacion: impuesto.impuesto_operacion,
    };
  }

  adaptarImpuestoDesdeConsultaDetalle(
    impuesto: DocumentoImpuestoFacturaRespuesta
  ): ImpuestoFormulario {
    return {
      id: impuesto.id,
      impuesto: impuesto.impuesto_id,
      base: impuesto.base,
      porcentaje: impuesto.porcentaje,
      total: impuesto.total,
      total_operado: impuesto.total_operado,
      nombre: impuesto.impuesto_nombre,
      nombre_extendido: impuesto.impuesto_nombre_extendido,
      impuesto_id: impuesto.impuesto_id,
      impuesto_nombre_extendido: impuesto.impuesto_nombre_extendido,
      impuesto_nombre: impuesto.impuesto_nombre,
      porcentaje_base: impuesto.impuesto_porcentaje_base,
      impuesto_venta: impuesto.impuesto_venta,
      impuesto_compra: impuesto.impuesto_compra,
      impuesto_operacion: impuesto.impuesto_operacion,
    };
  }

  adaptarItem(item: RespuestaAgregarDocumentoItem): DocumentoDetalleFactura {
    return {
      id: item.id,
      codigo: '',
      nombre: item.item__nombre,
      referencia: '',
      costo: item.precio,
      precio: item.precio,
      impuestos: [],
      cuenta_codigo: '',
      cuenta_id: 0,
      cuenta_nombre: '',
    };
  }
}
