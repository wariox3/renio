export interface AutocompletarRegistros<T> {
  cantidad_registros: number;
  registros: T[];
}

export interface RegistroAutocompletarCargo {
  cargo_id: number;
  cargo_nombre: string;
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
