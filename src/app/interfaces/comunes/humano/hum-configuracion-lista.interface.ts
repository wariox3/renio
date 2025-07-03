export interface HumConfiguracionProvision {
  id: number;
  tipo_costo: number;
  tipo: string;
  tipo_costo__nombre: string;
  cuenta_debito: any;
  cuenta_debito__nombre: string;
  cuenta_debito__codigo: string;
  cuenta_credito: any;
  cuenta_credito__nombre: string;
  cuenta_credito__codigo: string;
}


export interface HumConfiguracionAporte {
  id: number;
  tipo: string;
  orden: number;
  cuenta_id: any;
  cuenta_codigo: string;
  cuenta_nombre: string;
}
