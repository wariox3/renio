import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const CONTABILIZAR_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'numero', displayName: 'Número', type: 'string' },
    { name: 'documento_tipo__nombre', displayName: '[Documento tipo] Nombre', type: 'string' },
];