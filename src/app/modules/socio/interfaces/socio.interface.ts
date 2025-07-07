export interface ConsultaCredito {
    id: number
    tipo: string
    fecha: string
    fecha_vence: string
    descripcion: string
    vr_total: number
    vr_afectado: number
    vr_saldo: number
    documento_fisico: boolean
    contenedor_movimiento_id: number
    movimiento_referencia_id: number
    movimiento_referencia__usuario__username: string
    usuario_id: number
    usuario__username: string
    socio_id: number
  }
  