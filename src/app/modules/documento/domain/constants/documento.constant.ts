import { DocumentoClaseId, DocumentoTipoId } from '../enums/documento-tipo.enum';

/**
 * Agrupación de tipos de documento por categoría
 */
export const DOCUMENTO_TIPOS = {
  /**
   * Tipos de documento de VENTA
   */
  venta: [
    DocumentoTipoId.FACTURA_VENTA,
    DocumentoTipoId.NOTA_CREDITO_VENTA,
    DocumentoTipoId.NOTA_DEBITO_VENTA,
    DocumentoTipoId.FACTURA_RECURRENTE,
    DocumentoTipoId.CUENTA_COBRO,
    DocumentoTipoId.FACTURA_POS_ELECTRONICA,
    DocumentoTipoId.PEDIDO_CLIENTE,
    DocumentoTipoId.FACTURA_POS,
    DocumentoTipoId.REMISION,
  ],

  /**
   * Tipos de documento de COMPRA
   */
  compra: [
    DocumentoTipoId.FACTURA_COMPRA,
    DocumentoTipoId.NOTA_CREDITO_COMPRA,
    DocumentoTipoId.NOTA_DEBITO_COMPRA,
    DocumentoTipoId.DOCUMENTO_SOPORTE,
    DocumentoTipoId.NOTA_AJUSTE,
    DocumentoTipoId.COMPRA_RECURRENTE,
  ],
} as const;

/**
 * Agrupación de clases de documento por categoría
 */
export const DOCUMENTO_CLASES = {
  /**
   * Clases de documento de VENTA (keys 100-199)
   */
  venta: [
    DocumentoClaseId.FACTURA_VENTA,
    DocumentoClaseId.NOTA_CREDITO_VENTA,
    DocumentoClaseId.NOTA_DEBITO_VENTA,
    DocumentoClaseId.FACTURA_RECURRENTE,
    DocumentoClaseId.CUENTA_COBRO,
    DocumentoClaseId.FACTURA_POS_ELECTRONICA,
    DocumentoClaseId.PEDIDO_CLIENTE,
    DocumentoClaseId.FACTURA_POS,
    DocumentoClaseId.REMISION,
  ],

  /**
   * Clases de documento de COMPRA (keys 300-399)
   */
  compra: [
    DocumentoClaseId.FACTURA_COMPRA,
    DocumentoClaseId.NOTA_CREDITO_COMPRA,
    DocumentoClaseId.NOTA_DEBITO_COMPRA,
    DocumentoClaseId.DOCUMENTO_SOPORTE,
    DocumentoClaseId.NOTA_AJUSTE,
    DocumentoClaseId.COMPRA_RECURRENTE,
  ],
} as const;

/**
 * Mapeo de tipo de documento a clase de documento
 */
export const DOCUMENTO_TIPO_A_CLASE: Record<DocumentoTipoId, DocumentoClaseId> = {
  // Ventas
  [DocumentoTipoId.FACTURA_VENTA]: DocumentoClaseId.FACTURA_VENTA,
  [DocumentoTipoId.NOTA_CREDITO_VENTA]: DocumentoClaseId.NOTA_CREDITO_VENTA,
  [DocumentoTipoId.NOTA_DEBITO_VENTA]: DocumentoClaseId.NOTA_DEBITO_VENTA,
  [DocumentoTipoId.FACTURA_RECURRENTE]: DocumentoClaseId.FACTURA_RECURRENTE,
  [DocumentoTipoId.CUENTA_COBRO]: DocumentoClaseId.CUENTA_COBRO,
  [DocumentoTipoId.FACTURA_POS_ELECTRONICA]: DocumentoClaseId.FACTURA_POS_ELECTRONICA,
  [DocumentoTipoId.PEDIDO_CLIENTE]: DocumentoClaseId.PEDIDO_CLIENTE,
  [DocumentoTipoId.FACTURA_POS]: DocumentoClaseId.FACTURA_POS,
  [DocumentoTipoId.REMISION]: DocumentoClaseId.REMISION,

  // Compras
  [DocumentoTipoId.FACTURA_COMPRA]: DocumentoClaseId.FACTURA_COMPRA,
  [DocumentoTipoId.NOTA_CREDITO_COMPRA]: DocumentoClaseId.NOTA_CREDITO_COMPRA,
  [DocumentoTipoId.NOTA_DEBITO_COMPRA]: DocumentoClaseId.NOTA_DEBITO_COMPRA,
  [DocumentoTipoId.DOCUMENTO_SOPORTE]: DocumentoClaseId.DOCUMENTO_SOPORTE,
  [DocumentoTipoId.NOTA_AJUSTE]: DocumentoClaseId.NOTA_AJUSTE,
  [DocumentoTipoId.COMPRA_RECURRENTE]: DocumentoClaseId.COMPRA_RECURRENTE,
};

/**
 * Nombres legibles de los tipos de documento
 */
export const DOCUMENTO_TIPO_NOMBRES: Record<DocumentoTipoId, string> = {
  [DocumentoTipoId.FACTURA_VENTA]: 'Factura de Venta',
  [DocumentoTipoId.NOTA_CREDITO_VENTA]: 'Nota Crédito de Venta',
  [DocumentoTipoId.NOTA_DEBITO_VENTA]: 'Nota Débito de Venta',
  [DocumentoTipoId.FACTURA_COMPRA]: 'Factura de Compra',
  [DocumentoTipoId.NOTA_CREDITO_COMPRA]: 'Nota Crédito de Compra',
  [DocumentoTipoId.NOTA_DEBITO_COMPRA]: 'Nota Débito de Compra',
  [DocumentoTipoId.DOCUMENTO_SOPORTE]: 'Documento Soporte',
  [DocumentoTipoId.NOTA_AJUSTE]: 'Nota de Ajuste',
  [DocumentoTipoId.FACTURA_RECURRENTE]: 'Factura Recurrente',
  [DocumentoTipoId.CUENTA_COBRO]: 'Cuenta de Cobro',
  [DocumentoTipoId.FACTURA_POS_ELECTRONICA]: 'Factura POS Electrónica',
  [DocumentoTipoId.PEDIDO_CLIENTE]: 'Pedido de Cliente',
  [DocumentoTipoId.FACTURA_POS]: 'Factura POS',
  [DocumentoTipoId.REMISION]: 'Remisión',
  [DocumentoTipoId.COMPRA_RECURRENTE]: 'Compra Recurrente',
};
