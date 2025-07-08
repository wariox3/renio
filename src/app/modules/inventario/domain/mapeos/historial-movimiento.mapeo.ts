import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const HISTORIAL_MOVIMIENTO_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'documento__contacto__nombre_corto', displayName: '[Contacto] nombre', type: 'string' },
    { name: 'item__nombre', displayName: '[Item] nombre', type: 'string' },
    { name: 'cantidad', displayName: 'Cantidad', type: 'number' },
];