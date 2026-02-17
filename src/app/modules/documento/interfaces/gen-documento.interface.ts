import { GenDocumentoDetalle } from "./gen-documento-detalle.interface"
import { GenDocumentoPago } from "./gen-documento-pago.interface"

/**
 * Interfaz principal para documentos del sistema
 * Representa facturas de venta, compra, notas crédito/débito, etc.
 */
export interface GenDocumento {
    id: number
    numero: number | string | null
    fecha: string
    fecha_vence: string
    fecha_desde: string | null
    fecha_hasta: string | null
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
    comentario: string | null
    estado_electronico: boolean
    estado_electronico_enviado: boolean
    estado_electronico_notificado: boolean
    estado_electronico_evento: boolean
    soporte: string | null
    orden_compra: string | null
    remision: string | null
    plazo_pago_id: number
    plazo_pago_nombre: string
    documento_referencia_id: number | null
    documento_referencia_numero: string
    cue: string | null
    referencia_cue: string | null
    referencia_numero: string | null
    referencia_prefijo: string | null
    electronico_id: number | null
    asesor: number
    asesor_nombre_corto: string
    sede: number
    sede_nombre: string
    programacion_detalle_id: number | null
    contrato_id: number | null
    cuenta_banco_id: number | null
    cuenta_banco_nombre: string
    comprobante_id: number | null
    comprobante_nombre: string
    grupo_contabilidad_id: number | null
    grupo_contabilidad_nombre: string
    forma_pago_id: number | null
    forma_pago_nombre: string
    almacen_id: number
    almacen_nombre: string
    resolucion_id: number
    resolucion_numero: string
    cuenta_id: number | null
    cuenta_codigo: string
    cuenta_nombre: string
    detalles: GenDocumentoDetalle[]
    pagos: GenDocumentoPago[]
  }

  export interface GenerarMasivoPayload {
    generar_todos: boolean;
    ids?: number[];
  }
    