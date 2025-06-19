export interface Liquidacion {
    id: number;
    fecha: string;
    fecha_desde: string;
    fecha_hasta: string;
    contrato: number;
    dias: number;
    cesantia: number;
    interes: number;
    prima: number;
    vacacion: number;
    deduccion: number;
    adicion: number;
    total: number;
    estado_aprobado: boolean;
    estado_generado: boolean;
    comentario: string | null;
}