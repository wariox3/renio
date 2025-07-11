export interface Liquidacion {
    id: number
    fecha: string
    contrato__contacto__numero_identificacion: string
    contrato__contacto__nombre_corto: string
    contrato_id: number
    fecha_desde: string
    fecha_hasta: string
    total: number
    dias: number
    dias_cesantia: number
    dias_prima: number
    dias_vacacion: number
    cesantia: number
    interes: number
    prima: number
    vacacion: number
    deduccion: number
    adicion: number
    estado_generado: boolean
    estado_aprobado: boolean
    comentario: any
}