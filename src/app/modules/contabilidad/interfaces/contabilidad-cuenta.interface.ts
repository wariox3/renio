export interface ConCuenta {
  readonly id: number;
  codigo: string;
  nombre: string;
  exige_base: boolean;
  exige_tercero: boolean;
  exige_grupo: boolean;
  permite_movimiento: boolean;
  cuenta_clase?: number | null;
}
