export interface DetalleCuenta {
    id: number;
    naturaleza: string;
    precio: number;
    base: number;
    total: number;
    detalle: string;
    contacto__numero_identificacion: string;
    contacto__nombre_corto: string;
    cuenta__codigo: string;
    grupo__nombre: string;
}

export interface DetalleCierreEncabezado {
    id: number;
    numero: number;
    fecha: string;
    estado_aprobado: boolean;
    estado_anulado: boolean;
    contacto_id: number;
    contacto__numero_identificacion: string;
    contacto__nombre_corto: string;
    comentario: string;
    grupo_contabilidad__nombre: string;
    grupo_contabilidad: number;
}
