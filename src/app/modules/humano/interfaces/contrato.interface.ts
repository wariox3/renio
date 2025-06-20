export interface ProgramacionContrato {
  id: number;
  fecha_desde: Date;
  fecha_hasta: Date;
  salario: number;
  auxilio_transporte: boolean;
  salario_integral: boolean;
  estado_terminado: boolean;
  comentario: string | null;
  contrato_tipo_id: number;
  contrato_tipo_nombre: string;
  grupo_id: number;
  grupo_nombre: string;
  contacto_id: number;
  contacto_numero_identificacion: string;
  contacto_nombre_corto: string;
  sucursal_id: number;
  sucursal_nombre: string;
  riesgo_id: number;
  riesgo_nombre: string;
  fecha_ultimo_pago_vacacion: string;
  cargo_id: number;
  cargo_nombre: string;
  tipo_cotizante_id: number;
  tipo_cotizante_nombre: string;
  subtipo_cotizante_id: number;
  subtipo_cotizante_nombre: string;
  salud_id: number;
  salud_nombre: string;
  pension_id: number;
  pension_nombre: string;
  ciudad_contrato: number;
  ciudad_contrato_nombre: string;
  ciudad_labora: number;
  ciudad_labora_nombre: string;
  entidad_caja_id: number;
  entidad_caja_nombre: string;
  entidad_cesantias_id: number;
  entidad_cesantias_nombre: string;
  entidad_pension_id: number;
  entidad_pension_nombre: string;
  entidad_salud_id: number;
  entidad_salud_nombre: string;
  fecha_ultimo_pago: string | null;
  fecha_ultimo_pago_prima: string | null;
  fecha_ultimo_pago_cesantia: string | null;
  tiempo_id: number;
  tiempo_nombre: string | null;
  tipo_costo_id: number;
  tipo_costo_nombre: string;
  grupo_contabilidad_nombre: string;
}

export interface MotivoTerminacion {
  id: number;
  nombre: string;
}