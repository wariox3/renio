import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const ALMACEN_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'nombre', displayName: 'Nombre', type: 'string' },
];