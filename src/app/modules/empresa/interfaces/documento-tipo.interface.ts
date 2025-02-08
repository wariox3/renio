export interface DocumentoTipo {
  venta: boolean;
  compra: boolean;
  consecutivo: number;
  cuenta_cobrar_codigo: string;
  cuenta_cobrar_id: number;
  cuenta_cobrar_nombre: string;
  cuenta_pagar_codigo: string | null;
  cuenta_pagar_id: number | null;
  cuenta_pagar_nombre: string | null;
  id: number;
  nombre: string;
  operacion: number;
  resolucion_id: any;
  resolucion_numero: string;
  resolucion_prefijo: string;
}
