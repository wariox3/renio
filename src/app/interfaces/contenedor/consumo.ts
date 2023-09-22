export interface ConsumoPlan {
  plan_id: number;
  vr_plan: number;
  vr_total: number;
  plan_nombre: string
}


export interface Consumo {
  vr_plan: number;
  vr_total: number;
  consumosPlan: ConsumoPlan[];
}

