export interface ConPeriodo {
  id: number;
  anio: number;
  mes: number;
  estado_bloqueado: boolean;
  estado_cerrado: boolean;
  estado_inconsistencia: boolean;
}

export interface PeriodoInconsistencia {
  comprobante_id: number;
  numero: number;
  cuenta_id: any;
  documento_id?: number;
  documento_tipo_nombre?: string;
  inconsistencia: string;
}
