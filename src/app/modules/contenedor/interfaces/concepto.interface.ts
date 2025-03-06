export interface Concepto {
  id: number;
  nombre: string;
  porcentaje: string;
  ingreso_base_prestacion: boolean;
  ingreso_base_cotizacion: boolean;
  orden: number;
  concepto_tipo_id: number;
  concepto_tipo_nombre: string;
}
