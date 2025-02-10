export interface RegistroAutocompletarConMovimiento {
  id: number;
  fecha: Date;
  numero: number;
  contacto_nombre_corto: string;
  comprobante_nombre: string;
  cuenta_codigo: number;
  grupo_nombre: string;
  base: string;
  debito: string;
  credito: string;
  detalle?: string
}
