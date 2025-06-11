import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const ITEM_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'codigo', displayName: 'Código', type: 'string' },
    { name: 'nombre', displayName: 'Nombre', type: 'string' },
    { name: 'producto', displayName: 'Producto', type: 'boolean' },
    { name: 'servicio', displayName: 'Servicio', type: 'boolean' },
    { name: 'inventario', displayName: 'Inventario', type: 'boolean' },
    { name: 'negativo', displayName: 'Negativo', type: 'boolean' },
    { name: 'venta', displayName: 'Venta', type: 'boolean' },
    { name: 'favorito', displayName: 'Favorito', type: 'boolean' },
    { name: 'inactivo', displayName: 'Inactivo', type: 'boolean' },
    { name: 'existencia', displayName: 'Existencia', type: 'number' },
];