export interface AutocompletarRegistros<T> {
  cantidad_registros: number;
  registros: T[];
}

export interface RegistroAutocompletarHumTipoCotizante {
  tipo_cotizante_id: number;
  tipo_cotizante_nombre: string;
}
export interface RegistroAutocompletarCargo {
  cargo_id: number;
  cargo_nombre: string;
}

export interface RegistroAutocompletarHumConcepto {
  concepto_id: number;
  concepto_nombre: string;
}

export interface RegistroAutocompletarNovedadTipo {
  id: number;
  nombre: string;
}

export interface RegistroAutocompletarConceptoAdicional {
  id: number;
  nombre: string;
}

export interface RegistroAutocompletarContacto {
  contacto_id: number;
  contacto_nombre_corto: string;
  plazo_pago_id: number;
  plazo_pago_dias: number;
  plazo_pago_proveedor_id: number;
  plazo_pago_proveedor_dias: number;
}

export interface RegistroAutocompletarGenPlazoPago {
  plazo_pago_id: number;
  plazo_pago_nombre: string;
  plazo_pago_dias?: number;
  plazo_dias?: number;
}

export interface RegistroAutocompletarImpuesto {
  impuesto_id: number;
  impuesto_nombre: string;
  impuesto_nombre_extendido: string;
  impuesto_porcentaje: number;
  impuesto_compra: boolean;
  impuesto_venta: boolean;
  impuesto_porcentaje_base: number;
  impuesto_operacion: number;
}

export interface RegistroAutocompletarGenIdentificacion {
  identificacion_id: number;
  identificacion_nombre: string;
}

export interface RegistroAutocompletarGenRegimen {
  regimen_id: number;
  regimen_nombre: string;
}

export interface RegistroAutocompletarGenTipoPersona {
  tipo_persona_id: number;
  tipo_persona_nombre: string;
}

export interface RegistroAutocompletarResolucion {
  resolucion_id: number;
  resolucion_numero: string;
  resolucion_prefijo: string;
}

export interface RegistroAutocompletarGenCuentaBancoTipo {
  cuenta_banco_tipo_id: number;
  cuenta_banco_tipo_nombre: string;
}

export interface RegistroAutocompletarGenCuentaBancoClase {
  cuenta_banco_clase_id: number;
  cuenta_banco_clase: string;
  cuenta_banco_clase_nombre: string;
}

export interface RegistroAutocompletarGenCuentaBanco {
  cuenta_banco_id: number;
  cuenta_banco_nombre: string;
}

export interface RegistroAutocompletarGenBanco {
  id: number;
  nombre: string;
}

export interface RegistroAutocompletarGenCiudad {
  id: number;
  nombre: string;
  estado_nombre: string;
}

export interface RegistroAutocompletarHumPagoTipo {
  pago_tipo_id: number;
  pago_tipo_nombre: string;
}

export interface RegistroAutocompletarHumGrupo {
  grupo_id: number;
  grupo_nombre: string;
}

export interface RegistroAutocompletarHumContrato {
  contrato_id: number;
  contrato_contacto_numero_identificacion: string;
  contrato_contacto_nombre_corto: string;
}

export interface RegistroAutocompletarHumPerido {
  periodo_id: number;
  periodo_nombre: string;
}

export interface RegistroAutocompletarConCuenta {
  cuenta_codigo: number;
  cuenta_nombre: string;
  cuenta_id: string;
}

export interface RegistroAutocompletarConMovimiento {
  id: number;
  fecha: Date;
  numero: number;
  contacto_nombre_corto: string;
  comprobante_nombre: string;
  cuenta_codigo: number;
  grupo_nombre: string;
  base: string;
  debito: string;
  credito: string;
}

export interface RegistroAutocompletarGenDocumentoReferencia {
  id: number;
  numero: number;
}

export interface RegistroAutocompletarGenDocumento {
  id: number;
  numero: number;
  fecha: Date;
  fecha_vence: Date;
  contacto_id: number;
  contacto_nombre_corto: string;
  subtotal: number;
  impuesto: number;
  total: number;
  pendiente: boolean;
  documento_tipo_cuenta_cobrar_id: number;
  documento_tipo_cuenta_cobrar_cuenta_codigo: number;
  naturaleza?: 'C';
}

export interface RegistroAutocompletarGenMetodoPago {
  metodo_pago_id: number;
  metodo_pogo_nombre: string;
}
export interface RegistroAutocompletarGenAsesor {
  asesor_id: number;
  asesor_nombre_corto: string;
}

export interface RegistroAutocompletarGenSede {
  sede_id: number;
  sede_nombre: string;
}

export interface RegistroAutocompletarGenPrecio {
  precio_id: number;
  precio_nombre: string;
}

export interface RegistroAutocompletarHumCargo {
  cargo_id: number;
  cargo_codigo: string;
  cargo_nombre: string;
}

export interface RegistroAutocompletarHumEntidad {
  entidad_id: number;
  entidad_nombre: string;
}

export interface RegistroAutocompletarHumContratoTipo {
  contrato_tipo_id: number;
  contrato_tipo_nombre: string;
}

export interface RegistroAutocompletarConComprobante {
  comprobante_id: number;
  comprobante_nombre: string;
  comprobante_codigo: string;
}

export interface RegistroAutocompletarConGrupo {
  grupo_id: number;
  grupo_nombre: string;
}

