export interface GenDocumentoImpuesto {
  id: number;
  impuesto_id: number;
  impuesto_nombre: string;
  impuesto_nombre_extendido: string;
  impuesto_porcentaje: number;
  impuesto_operacion: number;
  impuesto_porcentaje_base: number;
  impuesto_venta: boolean;
  impuesto_compra: boolean;
  base: number;
  porcentaje: number;
  total: number;
  total_operado: number;
}
