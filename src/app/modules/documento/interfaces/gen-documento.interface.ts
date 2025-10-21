import { GenDocumentoDetalle } from "./gen-documento-detalle.interface"
import { GenDocumentoPago } from "./gen-documento-pago.interface"

export interface GenDocumento {
    id: number
    numero: any
    fecha: string
    fecha_vence: string
    fecha_desde: any
    fecha_hasta: any
    contacto_id: number
    contacto_numero_identificacion: string
    contacto_nombre_corto: string
    contacto_precio_id: number
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
    pago: number
    estado_aprobado: boolean
    documento_tipo_id: number
    metodo_pago_id: number
    metodo_pago_nombre: string
    estado_anulado: boolean
    estado_contabilizado: boolean
    comentario: any
    estado_electronico: boolean
    estado_electronico_enviado: boolean
    estado_electronico_notificado: boolean
    estado_electronico_evento: boolean
    soporte: any
    orden_compra: any
    remision: any
    plazo_pago_id: number
    plazo_pago_nombre: string
    documento_referencia_id: any
    documento_referencia_numero: string
    cue: any
    referencia_cue: any
    referencia_numero: any
    referencia_prefijo: any
    electronico_id: any
    asesor: number
    asesor_nombre_corto: string
    sede: number
    sede_nombre: string
    programacion_detalle_id: any
    contrato_id: any
    cuenta_banco_id: any
    cuenta_banco_nombre: string
    comprobante_id: any
    comprobante_nombre: string
    grupo_contabilidad_id: any
    grupo_contabilidad_nombre: string
    forma_pago_id: any
    forma_pago_nombre: string
    almacen_id: number
    almacen_nombre: string
    resolucion_id: number
    resolucion_numero: string
    cuenta_id: any
    cuenta_codigo: string
    cuenta_nombre: string
    detalles: GenDocumentoDetalle[]
    pagos: GenDocumentoPago[]
  }

  export interface GenerarMasivoPayload {
    generar_todos: boolean;
    ids?: number[];
  }
    