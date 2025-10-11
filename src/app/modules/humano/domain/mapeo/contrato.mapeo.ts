import { FilterField } from 'src/app/core/interfaces/filtro.interface';

export const CONTRATO_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'ID', type: 'number' },
  {
    name: 'contacto__numero_identificacion',
    displayName: 'Número de identificación',
    type: 'string',
  },
  { name: 'contacto__nombre_corto', displayName: 'Nombre', type: 'string' },
];

export const CONTRATO_LISTA_BUSCAR_AVANZADO: FilterField[] = [
  { name: 'id', displayName: 'ID', type: 'number' },
  {
    name: 'contacto_numero_identificacion',
    displayName: 'Número de identificación',
    type: 'string',
  },
  { name: 'contacto_nombre_corto', displayName: 'Nombre', type: 'string' },
];

export const CONTRATO_FILTRO_PERMANENTE: Record<string, any> = {
  // estado_terminado: 'False',
};
