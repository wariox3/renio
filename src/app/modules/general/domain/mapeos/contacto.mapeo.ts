import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const CONTACTO_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'nombre_corto', displayName: 'Nombre', type: 'string' },
    { name: 'numero_identificacion', displayName: 'Número de identificación', type: 'string' },
    { name: 'cliente', displayName: 'Cliente', type: 'boolean' },
    { name: 'proveedor', displayName: 'Proveedor', type: 'boolean' },
    { name: 'empleado', displayName: 'Empleado', type: 'boolean' },
];