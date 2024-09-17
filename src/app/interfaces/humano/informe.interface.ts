export interface NominaDetalle {
  id: number;
  documento_id: number;
  documento_tipo_nombre: string;
  documento_fecha: string;
  documento_numero: number;
  documento_contacto_nombre: string;
  concepto_id: number;
  concepto_nombre: string;
  detalle: any;
  porcentaje: number;
  cantidad: number;
  dias: number;
  hora: number;
  operacion: number;
  pago: number;
  pago_operado: number;
  devengado: number;
  deduccion: number;
  base_cotizacion: number;
  base_prestacion: number;
  base_impuesto: number;
}
