import { FilterField } from "src/app/core/interfaces/filtro.interface";

export const ENVIAR_FACTURA_ELECTRONICA_EMITIR_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'numero', displayName: 'Número', type: 'string' },
    { name: 'estado_electronico_notificado', displayName: 'Estado electronico notificado', type: 'boolean' },
    { name: 'estado_electronico_enviado', displayName: 'Estado electronico enviado', type: 'boolean' },
];

export const ENVIAR_FACTURA_ELECTRONICA_NOTIFICAR_FILTERS: FilterField[] = [
    { name: 'id', displayName: 'ID', type: 'number' },
    { name: 'numero', displayName: 'Número', type: 'string' },
];
    