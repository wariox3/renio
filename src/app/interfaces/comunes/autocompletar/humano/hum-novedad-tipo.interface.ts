export interface RegistroAutocompletarHumNovedadTipo {
  id: number;
  nombre: string;
}

export interface HumNovedadLista {
  id: number
  fecha_desde: string
  fecha_hasta: string
  fecha_desde_periodo: any
  fecha_hasta_periodo: any
  fecha_desde_empresa: string
  fecha_hasta_empresa: string
  fecha_desde_entidad: string
  fecha_hasta_entidad: string
  dias_disfrutados: number
  dias_disfrutados_reales: number
  dias_dinero: number
  dias: number
  dias_empresa: number
  dias_entidad: number
  pago_disfrute: number
  pago_dinero: number
  pago_dia_disfrute: number
  pago_dia_dinero: number
  base_cotizacion_propuesto: number
  base_cotizacion: number
  hora_empresa: number
  hora_entidad: number
  pago_empresa: number
  pago_entidad: number
  total: number
  contrato_id: number
  contrato_contacto_id: number
  contrato_contacto_numero_identificacion: string
  contrato_contacto_nombre_corto: string
  novedad_tipo_id: number
  novedad_tipo_nombre: string
  novedad_referencia_id: any
  prroroga: boolean
}
