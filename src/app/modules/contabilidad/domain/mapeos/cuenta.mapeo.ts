import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const CUENTA_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'nombre', displayName: 'Nombre', type: 'string' },
    { name: 'codigo', displayName: 'Código', type: 'string' },
    { name: 'estado_inactivo', displayName: 'Inactivo', type: 'boolean' },
];