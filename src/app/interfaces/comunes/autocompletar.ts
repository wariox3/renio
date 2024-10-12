export interface AutocompletarRegistros<T> {
  cantidad_registros: number;
  registros: T[];
}

export interface RegistroAutocompletarRiesgo {
  riesgo_id: number;
  riesgo_codigo: string;
  riesgo_nombre: string;
  riesgo_porcenjate: number;
}

export interface RegistroAutocompletarPension {
  pension_id: 1;
  pension_nombre: string;
}

export interface RegistroAutocompletarSubtipoCotizante {
  subtipo_cotizante_id: number;
  subtipo_cotizante_nombre: string;
}

export interface RegistroAutocompletarSalud {
  salud_id: number;
  salud_nombre: string;
}

export interface RegistroAutocompletarSucursal {
  sucursal_id: number;
  sucursal_nombre: string;
}

export interface RegistroAutocompletarTipoCotizante {
  tipo_cotizante_id: number;
  tipo_cotizante_nombre: string;
}
export interface RegistroAutocompletarCargo {
  cargo_id: number;
  cargo_nombre: string;
}

export interface RegistroAutocompletarConcepto {
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

export interface RegistroAutocompletarPlazoPago {
  plazo_pago_id: number;
  plazo_pago_nombre: string;
  plazo_pago_dias: number;

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

export interface RegistroAutocompletarIdentificacion {
  identificacion_id: number;
  identificacion_nombre: string;
}

export interface RegistroAutocompletarRegimen {
  regimen_id: number;
  regimen_nombre: string;
}

export interface RegistroAutocompletarTipoPersona {
  tipo_persona_id: number;
  tipo_persona_nombre: string;
}

export interface RegistroAutocompletarResolucion {
  resolucion_id: number;
  resolucion_numero: string;
  resolucion_prefijo: string;
}

export interface RegistroAutocompletarCuentaBancoTipo {
  cuenta_banco_tipo_id: number;
  cuenta_banco_tipo_nombre: string;
}

export interface RegistroAutocompletarCiudad {
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
