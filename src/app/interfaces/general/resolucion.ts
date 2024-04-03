export interface Resolucion {
    prefijo: string;
    numero: string;
    consecutivo_desde: number;
    consecutivo_hasta: number;
    fecha_desde: Date | undefined,
    fecha_hasta: Date | undefined
}
