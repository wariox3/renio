export interface NominaDetalleInforme {
    id: number
    documento: number
    documento__documento_tipo__nombre: string
    documento__fecha: string
    documento__fecha_hasta: any
    documento__numero: any
    documento__contacto: number
    documento__contacto__numero_identificacion: string
    documento__contacto__nombre_corto: string
    documento__contrato: any
    concepto: any
    detalle: any
    porcentaje: number
    cantidad: number
    dias: number
    hora: number
    operacion: number
    pago_operado: number
    devengado: number
    deduccion: number
    base_cotizacion: number
    base_prestacion: number
    base_impuesto: number
}
  