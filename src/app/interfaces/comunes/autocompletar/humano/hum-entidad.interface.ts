export interface RegistroAutocompletarHumEntidad {
  id: number;
  nombre: string;
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
