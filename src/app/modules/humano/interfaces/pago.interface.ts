export interface PagoRespuesta {
    documento: Pago
  }
  
  export interface Pago {
    id: number
    numero: any
    fecha: string
    fecha_vence: any
    fecha_hasta: any
    contacto_id: number
    contacto_numero_identificacion: string
    contacto_nombre_corto: string
    descuento: number
    base_impuesto: number
    subtotal: number
    afectado: number
    pendiente: number
    impuesto: number
    impuesto_retencion: number
    impuesto_operado: number
    total_bruto: number
    total: number
    devengado: number
    deduccion: number
    base_cotizacion: number
    base_prestacion: number
    salario: number
    estado_aprobado: boolean
    documento_tipo_id: number
    metodo_pago_id: any
    metodo_pago_nombre: string
    estado_anulado: boolean
    comentario: any
    estado_electronico: boolean
    estado_electronico_enviado: boolean
    estado_electronico_notificado: boolean
    estado_electronico_evento: boolean
    soporte: any
    orden_compra: any
    plazo_pago_id: any
    plazo_pago_nombre: string
    documento_referencia_id: any
    documento_referencia_numero: string
    cue: any
    referencia_cue: any
    referencia_numero: any
    referencia_prefijo: any
    electronico_id: any
    asesor: any
    asesor_nombre_corto: any
    sede: any
    sede_nombre: any
    programacion_detalle_id: any
    contrato_id: any
    cuenta_banco_id: any
    cuenta_banco_nombre: string
    comprobante_id: any
    comprobante_nombre: string
    grupo_contabilidad_id: any
    grupo_contabilidad_nombre: string
    detalles: any[]
    pagos: any[]
  }
  