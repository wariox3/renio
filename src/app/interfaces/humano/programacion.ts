export interface ProgramacionDetalleRegistro {
  id: number;
  diurna: number;
  nocturna: number;
  festiva_diurna: number;
  festiva_nocturna: number;
  extra_diurna: number;
  extra_nocturna: number;
  extra_festiva_diurna: number;
  extra_festiva_nocturna: number;
  recargo_nocturno: number;
  recargo_festivo_diurno: number;
  recargo_festivo_nocturno: number;
  contrato_id: number;
  contrato_contacto_id: number;
  contrato_contacto_numero_identificacion: string;
  contrato_contacto_nombre_corto: string;
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
  fecha_desde: Date;
  fecha_hasta: Date;
  salario: number;
  salario_promedio: number;
  dias: number;
  dias_transporte: number;
  neto: number;
  total: number;
  ingreso: boolean
  retiro: boolean;
}

export interface TablaRegistroLista extends ProgramacionDetalleRegistro {
  selected?: boolean;
}
