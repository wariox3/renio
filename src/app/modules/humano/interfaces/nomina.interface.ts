export interface Nomina {
  id: number;
  documento_tipo_id: number;
  numero: number;
  fecha: string;
  fecha_hasta: string;
  contacto_id: number;
  contacto_numero_identificacion: string;
  contacto_nombre_corto: string;
  salario: number;
  devengado: number;
  deduccion: number;
  total: number;
  estado_aprobado: boolean;
  estado_anulado: boolean;
  estado_electronico: boolean;
  cue: number | null;
}
