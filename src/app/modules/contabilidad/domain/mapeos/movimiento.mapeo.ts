import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const MOVIMIENTO_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'numero', displayName: 'Número', type: 'string' },
    { name: 'fecha', displayName: 'Fecha', type: 'date' },
    { name: 'cuenta__codigo', displayName: 'Cuenta código', type: 'string' },
    { name: 'grupo__codigo', displayName: '[Grupo] código', type: 'string' },
    { name: 'grupo__nombre', displayName: '[Grupo] nombre', type: 'string' },
    { name: 'contacto__nombre_corto', displayName: '[Contacto] nombre', type: 'string'},
    { name: 'contacto__numero_identificacion', displayName: '[Contacto] identificación', type: 'string'},
];
