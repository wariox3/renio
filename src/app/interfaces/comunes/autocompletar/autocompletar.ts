export interface AutocompletarRegistros<T> {
  cantidad_registros: number;
  registros: T[];
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

export interface RegistroAutocompletarResolucion {
  resolucion_id: number;
  resolucion_numero: string;
  resolucion_prefijo: string;
}
