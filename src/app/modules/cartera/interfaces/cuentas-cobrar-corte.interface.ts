export interface CuentasCobrarCorte {
  id: number;
  numero: number;
  fecha: string;
  fecha_vence: string;
  documento_tipo_id: number;
  subtotal: number;
  impuesto: number;
  total: number;
  abono: number;
  saldo: number;
  documento_tipo_nombre: string;
  contacto_numero_identificacion: string;
  contacto_nombre_corto: string;
}
