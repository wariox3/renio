import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const DOCUMENTO_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'numero', displayName: 'Número', type: 'number' },
    { name: 'fecha', displayName: 'Fecha', type: 'date' },
    { name: 'contacto__numero_identificacion', displayName: '[Contacto] Identificación', type: 'string' },
    { name: 'contacto__nombre_corto', displayName: '[Contacto] Nombre', type: 'string' },
    { name: 'estado_aprobado', displayName: 'Aprobado', type: 'boolean' },
    { name: 'estado_anulado', displayName: 'Anulado', type: 'boolean' },
    { name: 'estado_electronico', displayName: 'Electronico', type: 'boolean' },
    { name: 'estado_contabilizado', displayName: 'Contabilizado', type: 'boolean' },
];
