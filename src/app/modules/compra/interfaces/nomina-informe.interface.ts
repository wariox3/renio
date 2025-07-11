export interface NominaInforme {
  id: number;
  documento_tipo: number;
  numero: any;
  fecha: string;
  fecha_hasta: string;
  contacto: number;
  contacto__numero_identificacion: string;
  contacto__nombre_corto: string;
  salario: number;
  devengado: number;
  deduccion: number;
  total: number;
  base_cotizacion: number;
  base_prestacion: number;
  contrato_id: number;
  estado_aprobado: boolean;
  estado_anulado: boolean;
  estado_electronico: boolean;
  estado_contabilizado: boolean;
  cue: any;
}
