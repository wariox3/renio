import { GenDocumentoImpuesto } from "./gen-documento-impuesto.interface"

/**
 * Interfaz para los detalles/líneas de un documento
 * Representa items, servicios, o conceptos dentro de un documento
 */
export interface GenDocumentoDetalle {
    id: number
    tipo_registro: string
    item: number
    item_nombre: string
    cuenta: number | null
    cuenta_codigo: string
    cuenta_nombre: string
    cantidad: number
    cantidad_operada: number
    cantidad_afectada: number
    cantidad_pendiente: number
    precio: number
    pago: number
    pago_operado: number
    porcentaje: number
    porcentaje_descuento: number
    descuento: number
    subtotal: number
    total_bruto: number
    base: number
    base_impuesto: number
    impuesto: number
    impuesto_retencion: number
    impuesto_operado: number
    total: number
    hora: number
    dias: number
    devengado: number
    deduccion: number
    operacion: number
    operacion_inventario: number
    operacion_remision: number
    base_cotizacion: number
    base_prestacion: number
    base_prestacion_vacacion: number
    documento_afectado_id: number | null
    documento_afectado_documento_tipo_nombre: string
    documento_afectado_numero: string
    documento_afectado_contacto_nombre_corto: string
    documento_detalle_afectado_id: number | null
    contacto_id: number | null
    contacto_nombre_corto: string
    naturaleza: string | null
    detalle?: string
    numero: number | string | null
    concepto_id: number | null
    concepto_nombre: string
    credito_id: number | null
    grupo_id: number | null
    grupo_nombre: string
    almacen_id: number
    almacen_nombre: string[]
    documento_id: number
    documento_numero: number | string | null
    documento_fecha: string
    activo_id: number | null
    activo_codigo: string
    activo_nombre: string
    impuestos: GenDocumentoImpuesto[]
  }