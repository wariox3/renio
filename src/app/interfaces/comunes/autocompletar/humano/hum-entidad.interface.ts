export interface RegistroAutocompletarHumEntidad {
  entidad_id: number;
  entidad_nombre: string;
}

export interface RegistroHumEntidadLista {
  id: number;
  codigo: string;
  numero_identificacion: string;
  nombre: string;
  nombre_extendido: string;
  salud: boolean;
  pension: boolean;
  cesantias: boolean;
  caja: boolean;
  riesgo: boolean;
  sena: boolean;
  icbf: boolean;
}
