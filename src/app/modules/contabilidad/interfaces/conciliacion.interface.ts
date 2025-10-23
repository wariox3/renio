export interface Conciliacion {
    id: number;
    fecha_desde: string;
    fecha_hasta: string;
    cuenta_banco: number;
    cuenta_banco__nombre: string;
}

export interface ConciliacionSoporte {
    id: number;
    fecha: string;
    debito: number;
    credito: number;
    detalle: string;
    estado_conciliado: boolean;
    conciliacion: number;
    selected?: boolean;
}