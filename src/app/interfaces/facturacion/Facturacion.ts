export interface Factura {
  fecha: string;
  id: number;
  tipo: string;
  vr_saldo_enmascarado: string;
  vr_afectado: number;
  vr_saldo: number;
  vr_total: number;
}

export interface Facturas {
  movimientos: Factura[];
}

export interface Consumo {
  contenedor_id: number
  contenedor: string
  subdominio: string
  plan_id: number
  plan__nombre: string
  vr_total: number
}

export interface Consumos {
  consumos: Consumo[];
}
