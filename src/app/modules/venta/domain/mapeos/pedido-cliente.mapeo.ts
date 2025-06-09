import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const PEDIDO_CLIENTE_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'fecha', displayName: 'Fecha', type: 'date' },
    { name: 'cantidad', displayName: 'Cantidad', type: 'number' },
    { name: 'estado', displayName: 'Estado', type: 'boolean' },
];