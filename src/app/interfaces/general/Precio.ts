export interface Precio {
  readonly id: number;
  tipo: string;
  fecha_vence: Date | undefined;
  nombre: string;
}
