export interface Credito {
  id: number;
  fecha_inicio: string;
  total: number;
  abono: number;
  saldo: number;
  cuota: number;
  cantidad_cuotas: number;
  cuota_actual: number;
  validar_cuotas: boolean;
  contrato_id: number;
  contrato_contacto_id: number;
  contrato_contacto_numero_identificacion: string;
  contrato_contacto_nombre_corto: string;
  concepto_id: number;
  concepto_nombre: string;
  inactivo: boolean;
  inactivo_periodo: boolean;
  pagado: boolean;
  aplica_prima: boolean;
  aplica_cesantia: boolean;
}
