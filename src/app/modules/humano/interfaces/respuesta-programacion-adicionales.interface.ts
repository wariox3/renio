export interface RespuestaProgramacionDetalleAdicionales {
  id: number;
  valor: number;
  horas: number;
  aplica_dia_laborado: boolean;
  permanente: boolean;
  inactivo: boolean;
  inactivo_periodo: boolean;
  detalle: any;
  concepto_id: number;
  concepto_nombre: string;
  contrato_id: number;
  contrato_contacto_id: number;
  contrato_contacto_numero_identificacion: string;
  contrato_contacto_nombre_corto: string;
  programacion_id: number;
  selected: boolean;
}
