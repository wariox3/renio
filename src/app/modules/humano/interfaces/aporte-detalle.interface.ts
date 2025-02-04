import { RespuestaAporteDetalle } from './respuesta-aporte-detalle';

export interface AporteDetalle {
  registros: RespuestaAporteDetalle[];
  cantidad_registros: number;
}

export interface RespuestaEncabezadoAporteDetalle {
  id: number;
  fecha_desde: string;
  fecha_hasta: string;
  fecha_hasta_periodo: string;
  anio: number;
  mes: number;
  anio_salud: number;
  mes_salud: number;
  presentacion: string;
  estado_generado: boolean;
  estado_aprobado: boolean;
  cotizacion_pension: number;
  cotizacion_voluntario_pension_afiliado: number;
  cotizacion_voluntario_pension_aportante: number;
  cotizacion_solidaridad_solidaridad: number;
  cotizacion_solidaridad_subsistencia: number;
  cotizacion_salud: number;
  cotizacion_riesgos: number;
  cotizacion_caja: number;
  cotizacion_sena: number;
  cotizacion_icbf: number;
  cotizacion_total: number;
  contratos: number;
  empleados: number;
  lineas: number;
  sucursal_id: number;
  sucursal_nombre: string;
  entidad_riesgo_id: number;
  entidad_riesgo_nombre: string;
  base_cotizacion: number;
  entidad_sena_id: number;
  entidad_sena_nombre: string;
  entidad_icbf_id: number;
  entidad_icbf_nombre: string;
}
