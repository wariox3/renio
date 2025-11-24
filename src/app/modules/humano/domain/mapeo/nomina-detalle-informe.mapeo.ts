import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const NOMINA_DETALLE_INFORME_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'numero', displayName: 'Número', type: 'number' },
    { name: 'fecha', displayName: 'Fecha', type: 'date' },
    { name: 'documento__fecha_desde', displayName: 'Fecha desde', type: 'date' },
    { name: 'documento__fecha_hasta', displayName: 'Fecha hasta', type: 'date' },
    { name: 'documento__contacto__numero_identificacion', displayName: '[Empleado] Identificación', type: 'string' },
    { name: 'documento__contacto__nombre_corto', displayName: '[Empleado] Nombre', type: 'string' },
];
