import { FilterField } from 'src/app/core/interfaces/filtro.interface';

export const CREDITO_FILTERS: FilterField[] = [
  { name: 'id', displayName: 'ID', type: 'number' },
  {
    name: 'contrato__contacto__numero_identificacion',
    displayName: '[Contrato] Identificación',
    type: 'string',
  },
  {
    name: 'contrato__contacto__nombre_corto',
    displayName: '[Contrato] Nombre',
    type: 'string',
  },
  { name: 'fecha_inicio', displayName: 'Fecha inicio', type: 'date' },
  { name: 'valor_cuota', displayName: 'Valor cuota', type: 'number' },
  { name: 'validar_cuota', displayName: 'Validar cuotas', type: 'boolean' },
  { name: 'pagado', displayName: 'Pagado', type: 'boolean' },
  { name: 'incativo', displayName: 'Inactivo', type: 'boolean' },
];
