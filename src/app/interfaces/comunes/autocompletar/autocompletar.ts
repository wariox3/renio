export interface AutocompletarRegistros<T> {
  cantidad_registros: number;
  registros: T[];
}
export interface RegistroAutocompletarContacto {
  contacto_id: number;
  contacto_nombre_corto: string;
  plazo_pago_id: number;
  plazo_pago_dias: number;
  plazo_pago_proveedor_id: number;
  plazo_pago_proveedor_dias: number;
}
