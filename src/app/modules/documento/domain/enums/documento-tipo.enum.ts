/**
 * Enumeración de tipos de documento según el backend
 * Estos IDs son usados en documento_tipo_id
 */
export enum DocumentoTipoId {
  /** Factura de venta */
  FACTURA_VENTA = 1,

  /** Nota crédito de venta */
  NOTA_CREDITO_VENTA = 2,

  /** Nota débito de venta */
  NOTA_DEBITO_VENTA = 3,

  /** Factura de compra */
  FACTURA_COMPRA = 5,

  /** Nota crédito de compra */
  NOTA_CREDITO_COMPRA = 6,

  /** Nota débito de compra */
  NOTA_DEBITO_COMPRA = 7,

  /** Documento soporte (compra) */
  DOCUMENTO_SOPORTE = 11,

  /** Nota de ajuste */
  NOTA_AJUSTE = 12,

  /** Factura recurrente (venta) */
  FACTURA_RECURRENTE = 16,

  /** Cuenta de cobro */
  CUENTA_COBRO = 17,

  /** Factura POS electrónica */
  FACTURA_POS_ELECTRONICA = 24,

  /** Pedido de cliente */
  PEDIDO_CLIENTE = 26,

  /** Factura POS */
  FACTURA_POS = 27,

  /** Remisión */
  REMISION = 29,

  /** Compra recurrente */
  COMPRA_RECURRENTE = 32,
}

/**
 * Enumeración de clases de documento
 * Estos IDs son usados en documento_clase_id (keys en configuración)
 */
export enum DocumentoClaseId {
  // Clases de VENTA (100-199)
  /** Factura de venta (key: 100) */
  FACTURA_VENTA = 100,

  /** Nota crédito de venta (key: 101) */
  NOTA_CREDITO_VENTA = 101,

  /** Nota débito de venta (key: 102) */
  NOTA_DEBITO_VENTA = 102,

  /** Factura recurrente (key: 103) */
  FACTURA_RECURRENTE = 103,

  /** Cuenta de cobro (key: 104) */
  CUENTA_COBRO = 104,

  /** Factura POS electrónica (key: 105) */
  FACTURA_POS_ELECTRONICA = 105,

  /** Pedido de cliente (key: 106) */
  PEDIDO_CLIENTE = 106,

  /** Factura POS (key: 107) */
  FACTURA_POS = 107,

  /** Remisión (key: 108) */
  REMISION = 108,

  // Clases de COMPRA (300-399)
  /** Factura de compra (key: 300) */
  FACTURA_COMPRA = 300,

  /** Nota crédito de compra (key: 301) */
  NOTA_CREDITO_COMPRA = 301,

  /** Nota débito de compra (key: 302) */
  NOTA_DEBITO_COMPRA = 302,

  /** Documento soporte (key: 303) */
  DOCUMENTO_SOPORTE = 303,

  /** Nota de ajuste (key: 304) */
  NOTA_AJUSTE = 304,

  /** Compra recurrente (key: 305) */
  COMPRA_RECURRENTE = 305,
}

/**
 * Categorías de documentos
 */
export enum DocumentoCategoria {
  VENTA = 'venta',
  COMPRA = 'compra',
}
