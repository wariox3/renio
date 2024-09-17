export interface NominaElectronica {
  documento: Documento;
}

export interface Documento {
  id: number;
  numero: any;
  fecha: string;
  fecha_vence: any;
  fecha_hasta: any;
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
  estado_aprobado: boolean;
  documento_tipo_id: number;
  metodo_pago_id: any;
  metodo_pago_nombre: string;
  estado_anulado: boolean;
  comentario: any;
  estado_electronico: boolean;
  estado_electronico_enviado: boolean;
  estado_electronico_notificado: boolean;
  soporte: any;
  orden_compra: any;
  plazo_pago_id: any;
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
  detalles: any[];
  pagos: any[];
}

export interface NominaElectronica {
  id: number;
  documento_tipo_id: number;
  numero: number | null;
  fecha: Date;
  fecha_hasta: Date;
  contacto_id: number;
  contacto_numero_identificacion: string;
  contacto_nombre_corto: string;
  salario: number;
  devengado: number;
  deduccion: number;
  total: number;
  estado_aprobado: boolean;
  estado_anulado: boolean;
  estado_electronico: boolean;
  cue: number | null;
  contrato_id: number;
  base_cotizacion: number;
  base_prestacion: number;
}
