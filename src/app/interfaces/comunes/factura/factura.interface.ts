export interface ParametrosConsultaDetalle {
  venta: boolean;
  compra: boolean;
  id: number;
}

export interface AcumuladorImpuestos {
  [string: string]: { operado: number; total: number };
}

export interface AcumuladorDebitosCreditos {
  [string: string]: { operado: number; total: number };
}

export interface PagoFormulario {
  cuenta_banco: number;
  cuenta_banco_nombre: string;
  pago: number;
  pagos_eliminados: [];
  id: null | number;
}

export interface PagoRespuestaFormulario {
  id: number | null;
  documento_id: number;
  pago: number;
  cuenta_banco_id: number;
  cuenta_banco_nombre: string;
}

export interface DocumentoFactura {
  contacto_id: string;
  porcetanje_descuento: string;
  descuento: string;
  documento_tipo_id: string;
  fecha: string;
  fecha_vence: string;
  id: null | number;
  impuesto: number;
  base_impuesto: number;
  numero: null;
  subtotal: number;
  total: number;
  total_bruto: number;
  metodo_pago: null | number;
  detalles: object[];
  pagos: object[];
}

export interface ImpuestoRespuestaConsulta {
  id?: number | null;
  impuesto_id: number;
  impuesto_nombre: string;
  impuesto_nombre_extendido: string;
  impuesto_porcentaje: number;
  impuesto_porcentaje_base: number;
  impuesto_venta: boolean;
  impuesto_compra: boolean;
  impuesto_operacion: number;
}

export interface RespuestaItem {
  item: DocumentoDetalleFactura;
}

export interface DocumentoDetalleFactura {
  id: number;
  codigo: string;
  nombre: string;
  referencia: any;
  costo: number;
  precio: number;
  producto: boolean;
  servicio?: boolean;
  inventario?: boolean;
  existencia?: number;
  disponible?: number;
  impuestos: ImpuestoRespuestaConsulta[];
  cuenta_codigo: string;
  cuenta_id: number;
  cuenta_nombre: string;
}

export interface ImpuestoFormulario {
  id: number | null;
  impuesto: number;
  base?: number;
  porcentaje: number;
  total: number;
  total_operado: number;
  nombre: string;
  nombre_extendido: string;
  impuesto_id: number;
  impuesto_nombre_extendido: string;
  impuesto_nombre: string;
  porcentaje_base: number;
  impuesto_venta: boolean;
  impuesto_compra: boolean;
  impuesto_operacion: number;
}

export interface DocumentoImpuestoFacturaRespuesta {
  id: number;
  impuesto_id: number;
  impuesto_nombre: string;
  impuesto_nombre_extendido: string;
  impuesto_porcentaje: number;
  impuesto_operacion: number;
  impuesto_porcentaje_base: number;
  impuesto_venta: boolean;
  impuesto_compra: boolean;
  base: number;
  porcentaje: number;
  total: number;
  total_operado: number;
}

// respuesta consulta detalle

export interface DocumentoFacturaRespuesta {
  id: number;
  numero: any;
  fecha: string;
  fecha_vence: string;
  fecha_hasta: any;
  impuesto_operado: number;
  contacto_id: number;
  contacto_numero_identificacion: string;
  contacto_nombre_corto: string;
  descuento: number;
  base_impuesto: number;
  subtotal: number;
  afectado: number;
  pendiente: number;
  impuesto: number;
  total: number;
  devengado: number;
  deduccion: number;
  base_cotizacion: number;
  base_prestacion: number;
  salario: number;
  documento_tipo_id: number;
  metodo_pago_id: number;
  metodo_pago_nombre: string;
  forma_pago_id: number;
  forma_pago_nombre: string;
  estado_anulado: boolean;
  comentario: any;
  estado_electronico: boolean;
  estado_electronico_enviado: boolean;
  estado_electronico_notificado: boolean;
  soporte: any;
  orden_compra: any;
  plazo_pago_id: number;
  plazo_pago_nombre: string;
  documento_referencia_id: any;
  documento_referencia_numero: string;
  cue: any;
  electronico_id: any;
  asesor: any;
  asesor_nombre_corto: any;
  sede: any;
  sede_nombre: any;
  programacion_detalle_id: any;
  contrato_id: any;
  detalles: DocumentoFacturaDetalleRespuesta[];
  pagos: PagoRespuestaFormulario[];
  referencia_cue: string;
  referencia_numero: number;
  referencia_prefijo: string;
  grupo_contabilidad_id: number;
  almacen_id: number;
  almacen_nombre: string;
  resolucion_id: number;
  resolucion_numero: number;
  grupo_contabilidad_nombre: string;
  cuenta_id: number;
  cuenta_codigo: string;
  cuenta_nombre: string;
  estado_aprobado: boolean;
}

export interface DocumentoFacturaDetalleRespuesta {
  id: number;
  documento_id: number;
  item: number;
  item_nombre: string;
  cuenta: any;
  cuenta_codigo: string;
  cuenta_nombre: string;
  cantidad: number;
  precio: number;
  pago: number;
  pago_operado: number;
  porcentaje: number;
  porcentaje_descuento: number;
  descuento: number;
  subtotal: number;
  total_bruto: number;
  base_impuesto: number;
  base: number;
  impuesto: number;
  impuesto_operado: number;
  impuesto_retencion: number;
  total: number;
  hora: number;
  dias: number;
  devengado: number;
  deducion: number;
  operacion: number;
  base_cotizacion: number;
  base_prestacion: number;
  documento_afectado_id: any;
  documento_afectado_numero: string;
  documento_afectado_contacto_nombre_corto: string;
  contacto_id: any;
  contacto_nombre_corto: string;
  naturaleza: any;
  detalle: any;
  numero: any;
  concepto_id: any;
  concepto_nombre: string;
  tipo_registro: string;
  credito_id: any;
  grupo_id: number;
  grupo_nombre: string;
  almacen_id: number;
  almacen_nombre: string;
  impuestos: DocumentoImpuestoFacturaRespuesta[];
}

export interface DocumentoInventarioRespuesta
  extends DocumentoFacturaRespuesta {
  almacen_id: number;
  almacen_nombre: string;
}
