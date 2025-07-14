export interface CuentasCobrarCorte {
    id: number
    numero: number
    fecha: string
    fecha_vence: string
    documento_tipo_id: number
    subtotal: number
    impuesto: number
    total: number
    abono: number
    saldo: number
    documento_tipo__nombre: string
    contacto__numero_identificacion: string
    contacto__nombre_corto: string 
}
