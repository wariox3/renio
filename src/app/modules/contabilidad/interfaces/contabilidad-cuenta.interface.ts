export interface ConCuenta {
  readonly id: number;
  codigo: string;
  nombre: string;
  exige_base: boolean;
  exige_contacto: boolean;
  exige_grupo: boolean;
  permite_movimiento: boolean;
  cuenta_clase?: number | null;
  cuenta_clase_id: number;
  cuenta_grupo_id: number;
  cuenta_cuenta_id: number;
  cuenta_clase_nombre: string;
  cuenta_grupo_nombre: string;
  cuenta_cuenta_nombre: string;
}
