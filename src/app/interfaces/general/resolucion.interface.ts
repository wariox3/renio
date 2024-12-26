export interface Resolucion {
  readonly id?: number;
  prefijo: string;
  numero: string;
  consecutivo_desde: number;
  consecutivo_hasta: number;
  fecha_desde: Date | undefined;
  fecha_hasta: Date | undefined;
  venta: boolean;
  compra: boolean;
}
