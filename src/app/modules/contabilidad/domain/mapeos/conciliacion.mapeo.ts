import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const CONCILIACION_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'Id', type: 'number' },
    { name: 'fecha_desde', displayName: 'Fecha desde', type: 'date' },
    { name: 'fecha_hasta', displayName: 'Fecha hasta', type: 'date' },
    { name: 'cuenta_banco__nombre', displayName: 'Cuenta banco', type: 'string' },
];