export interface Aporte {
  id: number;
  fecha_desde: string;
  fecha_hasta: string;
  fecha_hasta_periodo: string;
  anio: number;
  mes: number;
  anio_salud: number;
  mes_salud: number;
  estado_generado: boolean;
  estado_aprobado: boolean;
  sucursal_id: number;
  sucursal_nombre: string;
}

export interface Configuracion {
  configuracion: ConfiguracionHumanoEntidad[];
}

export interface ConfiguracionHumanoEntidad {
  hum_entidad_riesgo: number;
}
