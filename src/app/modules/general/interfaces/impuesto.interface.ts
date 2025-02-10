export interface Impuesto {
  id: number;
  nombre: string;
  nombre_extendido: string;
  porcentaje: number;
  compra: boolean;
  venta: boolean;
  porcentaje_base: number;
  operacion: number;
  cuenta_id?: number;
  cuenta_codigo?: string;
  cuenta_nombre?: string;
}
