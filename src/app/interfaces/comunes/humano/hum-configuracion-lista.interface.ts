export interface HumConfiguracionProvision {
  id: number;
  tipo: string;
  orden: number;
  tipo_costo_id: number;
  tipo_costo_nombre: string;
  cuenta_debito_id: any;
  cuenta_debito_nombre: string;
  cuenta_debito_codigo: string;
  cuenta_credito_id: any;
  cuenta_credito_nombre: string;
  cuenta_credito_codigo: string;
}

export interface HumConfiguracionAporte {
  id: number;
  tipo: string;
  orden: number;
  cuenta_id: any;
  cuenta_codigo: string;
  cuenta_nombre: string;
}
