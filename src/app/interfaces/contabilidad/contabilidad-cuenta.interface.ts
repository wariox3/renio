export interface ConCuenta {
  readonly id: number;
  codigo: number;
  nombre: string;
  exige_base: boolean;
  exige_tercero: boolean;
  exige_grupo: boolean;
  permite_movimiento: boolean;
  cuenta_clase?: number | null;
}
