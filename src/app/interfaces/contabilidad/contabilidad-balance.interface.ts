export interface RespuestaInformeBalancePrueba {
  registros: MovimientoBalancePrueba[];
}

export interface MovimientoBalancePrueba {
  id: number;
  codigo: string;
  nombre: string;
  cuenta_clase_id: number;
  cuenta_grupo_id: number;
  cuenta_cuenta_id: number;
  saldo_anterior: number;
  saldo_actual: number;
  nivel: number;
  vr_debito_anterior: number | null;
  vr_credito_anterior: number | null;
  debito: number | null;
  credito: number | null;
}
