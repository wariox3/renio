import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const CONTRATO_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'numero_identificacion', displayName: 'Número de identificación', type: 'string' },
    { name: 'nombre_corto', displayName: 'Nombre', type: 'string' },
    { name: 'estado_terminado', displayName: 'Terminado', type: 'boolean' },
];