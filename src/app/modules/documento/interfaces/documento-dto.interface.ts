import { GenDocumento } from './gen-documento.interface';
import { GenDocumentoDetalle } from './gen-documento-detalle.interface';
import { GenDocumentoPago } from './gen-documento-pago.interface';

/**
 * DTO para crear un nuevo documento
 */
export interface CrearDocumentoDto {
  contacto_id: number;
  documento_tipo_id: number;
  fecha: string;
  fecha_vence?: string;
  metodo_pago_id?: number;
  plazo_pago_id?: number;
  comentario?: string;
  soporte?: string;
  orden_compra?: string;
  remision?: string;
  documento_referencia_id?: number;
  asesor?: number;
  sede?: number;
  almacen_id?: number;
  resolucion_id?: number;
  cuenta_banco_id?: number;
  forma_pago_id?: number;
  detalles?: CrearDocumentoDetalleDto[];
  pagos?: CrearDocumentoPagoDto[];
}

/**
 * DTO para actualizar un documento existente
 */
export interface ActualizarDocumentoDto {
  id: number;
  contacto_id?: number;
  fecha?: string;
  fecha_vence?: string;
  metodo_pago_id?: number;
  plazo_pago_id?: number;
  comentario?: string;
  soporte?: string;
  orden_compra?: string;
  remision?: string;
  asesor?: number;
  sede?: number;
  almacen_id?: number;
  cuenta_banco_id?: number;
  forma_pago_id?: number;
  detalles?: ActualizarDocumentoDetalleDto[];
  pagos?: CrearDocumentoPagoDto[];
}

/**
 * DTO para crear un detalle de documento
 */
export interface CrearDocumentoDetalleDto {
  item?: number;
  cuenta?: number;
  cantidad: number;
  precio: number;
  porcentaje_descuento?: number;
  detalle?: string;
  concepto_id?: number;
  almacen_id?: number;
  documento_afectado_id?: number;
  documento_detalle_afectado_id?: number;
}

/**
 * DTO para actualizar un detalle de documento
 */
export interface ActualizarDocumentoDetalleDto {
  id: number;
  cantidad?: number;
  precio?: number;
  porcentaje_descuento?: number;
  detalle?: string;
}

/**
 * DTO para crear un pago de documento
 */
export interface CrearDocumentoPagoDto {
  pago: number;
  cuenta_banco_id: number;
}

/**
 * DTO para filtrar documentos en listados
 */
export interface DocumentoFiltrosDto {
  documento_tipo_id?: number;
  estado_aprobado?: boolean;
  estado_anulado?: boolean;
  estado_electronico?: boolean;
  estado_contabilizado?: boolean;
  contacto_id?: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  search?: string;
  limite?: number;
  desplazar?: number;
}

/**
 * DTO para filtrar detalles de documentos
 */
export interface DocumentoDetalleFiltrosDto {
  documento_id?: number;
  item?: number;
  limite?: number;
  desplazar?: number;
}

/**
 * Response al aprobar un documento
 */
export interface DocumentoAprobadoResponse {
  id: number;
  estado_aprobado: boolean;
  mensaje?: string;
}

/**
 * Response al emitir un documento electrónico
 */
export interface DocumentoEmitidoResponse {
  id: number;
  estado_electronico: boolean;
  electronico_id?: number;
  mensaje?: string;
}

/**
 * Response al anular un documento
 */
export interface DocumentoAnuladoResponse {
  id: number;
  estado_anulado: boolean;
  mensaje?: string;
}

/**
 * Response al generar documentos masivamente
 */
export interface GenerarMasivoResponse {
  cantidad_generados: number;
  documentos_generados: number[];
  errores?: string[];
}

/**
 * DTO para adicionar una guía a un documento
 */
export interface AdicionarGuiaDto {
  documento_id: number;
  guia_id: number;
}

/**
 * Interface para guías de documento
 */
export interface GenDocumentoGuia {
  id: number;
  documento_id: number;
  guia_id: number;
  guia_numero: string;
  guia_fecha: string;
}

/**
 * DTO para cargar cierre de documentos
 */
export interface CargarCierreDto {
  archivo: File | string;
  documento_tipo_id?: number;
  fecha?: string;
}

/**
 * Response al cargar cierre
 */
export interface CargarCierreResponse {
  documentos_procesados: number;
  errores?: string[];
  mensaje?: string;
}
