export interface ConfiguracionEmpresa {
  id: number;
  empresa: number;
  informacion_factura: string | null;
  informacion_factura_superior: string | null;
  venta_asesor: boolean;
  venta_sede: boolean;
  gen_uvt: string;
  hum_factor: string;
  hum_salario_minimo: string;
  hum_auxilio_transporte: string;
}
