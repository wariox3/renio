export interface Plan {
  id: number;
  nombre: string;
  precio: number;
  plan_tipo_id: 'F' | 'E';
}
