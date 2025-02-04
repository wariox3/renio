export interface GenerarProgramacionRespuesta {
  total: number;
  devengado: number;
  deduccion: number;
}

export interface DesgenerarProgramacionRespuesta {
  mensaje: string;
}

export interface CargarContratosRespuesta {
  contratos: number;
}

export interface ProgramacionRespuesta {
  id: number;
  fecha_desde: string;
  fecha_hasta: string;
  fecha_hasta_periodo: string;
  nombre: string;
  devengado: number;
  deduccion: number;
  total: number;
  contratos: number;
  dias: number;
  comentario: any;
  pago_horas: boolean;
  pago_auxilio_transporte: boolean;
  pago_incapacidad: boolean;
  pago_licencia: boolean;
  pago_vacacion: boolean;
  descuento_salud: boolean;
  descuento_pension: boolean;
  descuento_fondo_solidaridad: boolean;
  descuento_retencion_fuente: boolean;
  adicional: boolean;
  descuento_credito: boolean;
  descuento_embargo: boolean;
  pago_tipo_id: number;
  pago_tipo_nombre: string;
  grupo_id: number;
  grupo_nombre: string;
  periodo_id: number;
  periodo_nombre: string;
  estado_generado: boolean;
  estado_aprobado: boolean;
  pago_prima: boolean;
  pago_interes: boolean;
  pago_cesantia: boolean;
}
