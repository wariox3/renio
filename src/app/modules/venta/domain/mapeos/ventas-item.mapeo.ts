import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const VENTAS_ITEM_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'documento__numero', displayName: '[Documento] número', type: 'string'},
    { name: 'documento__fecha', displayName: '[Documento] fecha', type: 'date'},
    { name: 'item_id', displayName: 'Item id', type: 'number'},
    { name: 'item__nombre', displayName: '[Item] nombre', type: 'string'},
    { name: 'documento__contacto__nombre_corto', displayName: '[Contacto] nombre', type: 'string'},
    { name: 'documento__contacto__numero_identificacion', displayName: '[Contacto] identificación', type: 'string'},
];
