export interface Item {
  readonly id: number,
  nombre: string;
  codigo: string | null;
  referencia: string | null;
  costo: number;
  precio: number;
}
