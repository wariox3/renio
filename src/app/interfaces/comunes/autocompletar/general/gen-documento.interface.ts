export interface RegistroAutocompletarGenDocumento {
  id: number;
  numero: number;
  fecha: Date;
  fecha_vence: Date;
  contacto_id: number;
  contacto_nombre_corto: string;
  subtotal: number;
  impuesto: number;
  total: number;
  pendiente: boolean;
  documento_tipo_cuenta_cobrar_id: number;
  documento_tipo_cuenta_cobrar_cuenta_codigo: number;
  naturaleza?: 'C';
}

export interface RegistroAutocompletarGenDocumentoReferencia {
  id: number;
  numero: number;
}
