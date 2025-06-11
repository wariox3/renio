import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const CUENTA_BANCO_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'nombre', displayName: 'Nombre', type: 'string' },
    { name: 'numero_cuenta', displayName: 'Número de Cuenta', type: 'number' },
];