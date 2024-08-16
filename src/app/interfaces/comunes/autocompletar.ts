export interface AutocompletarRegistros<T> {
  cantidad_registros: number;
  registros: T[];
}

export interface RegistroAutocompletarRiesgo {
  riesgo_id: number;
  riesgo_codigo: string;
  riesgo_nombre: string;
  riesgo_porcenjate: number;
}

export interface RegistroAutocompletarPension {
  pension_id: 1;
  pension_nombre: string;
}

export interface RegistroAutocompletarSubtipoCotizante {
  subtipo_cotizante_id: number;
  subtipo_cotizante_nombre: string;
}

export interface RegistroAutocompletarSalud {
  salud_id: number;
  salud_nombre: string;
}

export interface RegistroAutocompletarSucursal {
  sucursal_id: number;
  sucursal_nombre: string;
}

export interface RegistroAutocompletarTipoCotizante {
  tipo_cotizante_id: number;
  tipo_cotizante_nombre: string;
}
export interface RegistroAutocompletarCargo {
  cargo_id: number;
  cargo_nombre: string;
}