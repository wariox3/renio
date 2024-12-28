import { AplicacionModulo } from '@comun/type/aplicacion-modulo.type';
import { AplicacionUbicaciones } from '@comun/type/aplicaciones-ubicaciones.type';
import { Modelo } from '@comun/type/modelo.type';

export type FormulariosDetalles = Record<
  Modelo | number,
  {
    modulo?: AplicacionModulo;
    modelo?: string;
    tipo?: AplicacionUbicaciones;
    detalle: () => Promise<{ default: any }>;
    formulario: () => Promise<{ default: any }>;
  }
>;
