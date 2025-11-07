export interface ConsumoUsuario {
  consumos: Consumo[];
  total_consumo: number;
  plan_precio: number;
}

export interface Consumo {
  usuario_id: number;
  contenedor_id: number;
  contenedor: string;
  subdominio: string;
  plan_id: number;
  plan__nombre: string;
  plan__precio: number;
  dias: number;
  vr_total: number;
}
