export interface RespuestaInformeBalancePrueba {
  movimientos: MovimientoBalancePrueba[];
}

export interface MovimientoBalancePrueba {
  id: number;
  codigo: string;
  cuenta_clase_id: number;
  cuenta_grupo_id: number;
  cuenta_cuenta_id: number;
  nivel: number;
  vr_debito_anterior: number | null;
  vr_credito_anterior: number | null;
  vr_debito: number | null;
  vr_credito: number | null;
}
