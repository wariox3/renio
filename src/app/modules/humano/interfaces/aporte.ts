export interface Aporte {
  id: number;
  fecha_desde: string;
  fecha_hasta: string;
  fecha_hasta_periodo: string;
  anio: number;
  mes: number;
  anio_salud: number;
  mes_salud: number;
  estado_generado: boolean;
  estado_aprobado: boolean;
  sucursal_id: number;
  sucursal_nombre: string;
}

export interface Configuracion {
  configuracion: ConfiguracionHumanoEntidad[];
}

export interface ConfiguracionHumanoEntidad {
  hum_entidad_riesgo: number;
}

export interface DocumentoDetalle {
  id: number
  documento: number
  documento__documento_tipo__nombre: string
  documento__fecha: string
  documento__fecha_desde: string
  documento__fecha_hasta: string
  documento__numero: number
  documento__contacto: number
  documento__contacto__numero_identificacion: string
  documento__contacto__nombre_corto: string
  documento__contrato: number
  concepto: number
  concepto__nombre: string
  detalle: any
  porcentaje: number
  cantidad: number
  dias: number
  hora: number
  operacion: number
  pago_operado: number
  devengado: number
  deduccion: number
  total: number
  base_cotizacion: number
  base_prestacion: number
  base_impuesto: number
}

export interface Documento {
  id: number
  documento_tipo__nombre: string
  numero: any
  fecha: string
  fecha_desde: any
  fecha_hasta: any
  contacto_id: number
  contacto__numero_identificacion: string
  contacto__nombre_corto: string
  contrato_id: any
  salario: number
  base_cotizacion: number
  base_prestacion: number
  devengado: number
  deduccion: number
  total: number
  estado_aprobado: boolean
  estado_anulado: boolean
  estado_electronico: boolean
  estado_electronico_evento: boolean
  estado_contabilizado: boolean
}

