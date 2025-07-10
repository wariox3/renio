import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const CUENTAS_COBRAR_CORTE_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'numero', displayName: 'Número', type: 'string'},
    { name: 'fecha', displayName: 'Fecha', type: 'date'},
    { name: 'documento_tipo_id', displayName: '[Documento tipo] id', type: 'number'},
    { name: 'documento_tipo__nombre', displayName: '[Documento tipo] nombre', type: 'string'},
    { name: 'contacto__nombre_corto', displayName: '[Contacto] nombre', type: 'string'},
    { name: 'contacto__numero_identificacion', displayName: '[Contacto] identificación', type: 'string'},
];