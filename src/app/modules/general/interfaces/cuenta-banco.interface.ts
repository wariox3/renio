export interface CuentaBanco {
  id?: number;
  nombre: string;
  numero_cuenta: number | null;
  cuenta_banco_tipo_id: number;
  cuenta_banco_tipo_nombre: string;
  cuenta_banco_clase_id: number | null;
  cuenta_banco_clase_nombre: string;
  cuenta_codigo: string;
  cuenta_id: number;
  cuenta_nombre: string;
}
