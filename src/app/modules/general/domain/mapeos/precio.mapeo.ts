import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const PRECIO_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'nombre', displayName: 'Nombre', type: 'string' },
    { name: 'tipo', displayName: 'Tipo', type: 'string' },
    { name: 'fecha_vence', displayName: 'Fecha Vence', type: 'date' },
];