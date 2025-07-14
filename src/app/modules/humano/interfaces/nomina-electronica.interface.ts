export interface NominaElectronicaDetalle {
  id: number;
  documento_tipo__nombre: string;
  numero: number;
  fecha: string;
  fecha_desde: string;
  fecha_hasta: string;
  contacto_id: number;
  contacto__numero_identificacion: string;
  contacto__nombre_corto: string;
  contrato_id: number;
  salario: number;
  base_cotizacion: number;
  base_prestacion: number;
  devengado: number;
  deduccion: number;
  total: number;
  estado_aprobado: boolean;
  estado_anulado: boolean;
  estado_electronico: boolean;
  estado_electronico_evento: boolean;
  estado_contabilizado: boolean;
}

export interface NominaElectronicaDetalleNomina {
  id: number
  documento_tipo__nombre: string
  numero: number
  fecha: string
  soporte: any
  contacto_id: number
  contacto__numero_identificacion: string
  contacto__nombre_corto: string
  devengado: number
  deduccion: number
  base_cotizacion: number
  base_prestacion: number
  subtotal: number
  impuesto: number
  total: number
  cue: any
  estado_aprobado: boolean
  estado_anulado: boolean
  estado_electronico: boolean
  estado_electronico_evento: boolean
  estado_contabilizado: boolean
  estado_electronico_enviado: boolean
}


export interface NominaElectronica {
    id: number,
    contacto_id: number,
    contacto_numero_identificacion: string,
    contacto_nombre_corto: string,
    descuento: number,
    base_impuesto: number,
    subtotal: number,
    afectado: number,
    pendiente: number,
    impuesto: number,
    total: number,
    devengado: number,
    deduccion: number,
    base_cotizacion: number,
    base_prestacion: number,
    salario: number,
    estado_aprobado: boolean,
    documento_tipo_id: number,
    metodo_pago_id: number,
    metodo_pago_nombre: string,
    estado_anulado: boolean,
    comentario: string,
    estado_electronico: boolean,
    estado_electronico_enviado: boolean,
    estado_electronico_notificado: boolean,
    soporte: string,
    orden_compra: string,
    plazo_pago_id: number,
    plazo_pago_nombre: string,
    documento_referencia_id: number,
    documento_referencia_numero: string,
    electronico_id: number,
    asesor: string,
    asesor_nombre_corto: string,
    sede: string,
    sede_nombre: string,
    programacion_detalle_id: number,
    contrato_id: number,
    detalles: [],
    pagos: [],
    numero: number,
    cue: string,
    fecha: string,
    fecha_hasta: string,
    fecha_vence: string
}
  