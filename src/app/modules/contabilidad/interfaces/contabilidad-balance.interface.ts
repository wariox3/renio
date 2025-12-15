export interface RespuestaInformeBalancePrueba {
  registros: MovimientoBalancePrueba[];
}

export interface RespuestaInformeBalancePruebaTerceros {
  registros: MovimientoBalancePruebaTercero[];
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
  contacto_numero_identificacion: string;
  contacto_nombre_corto: string;
  cuenta_codigo: string;
  cuenta_nombre: string;
  base_retenido: string;
  retenido: string;
}

export interface MovimientoAuxiliarCuenta {
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

export interface MovimientoAuxiliarTercero {
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

export interface MovimientoAuxiliarGeneral {
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

export interface MovimientoBalancePruebaTercero
  extends MovimientoBalancePrueba {
  contacto_id: number;
  contacto_nombre_corto: string;
  contacto_numero_identificacion: string;
  comprobante_nombre: string;
  numero: string;
  fecha: string;
  cuenta_codigo: string;
  cuenta_nombre: string;
  base: string;
  detalle: string;
}

export interface MovimientoAuxiliarGeneral extends MovimientoBalancePrueba {
  contacto_id: number;
  contacto_nombre_corto: string;
  comprobante_nombre: string;
  contacto_numero_identificacion: string;
  numero: number;
  fecha: string;
}

export interface MovimientoAuxiliarTercero extends MovimientoBalancePrueba {
  contacto_id: number;
  contacto_nombre_corto: string;
  contacto_numero_identificacion: string;
}

export interface MovimientoEstadoResultados {
    id: number;
  cuenta_clase_id: number;
  cuenta_clase_nombre: string;
  cuenta_grupo_id: number;
  cuenta_grupo_nombre: string;
  cuenta_codigo: string;
  cuenta_nombre: string;
  debito: number;
  credito: number;
  saldo: number;
}

export interface MovimientoSituacionFinanciera {
    id: number;
  cuenta_clase_id: number;
  cuenta_clase_nombre: string;
  cuenta_grupo_id: number;
  cuenta_grupo_nombre: string;
  cuenta_codigo: string;
  cuenta_nombre: string;
  debito: number;
  credito: number;
  saldo: number;
}