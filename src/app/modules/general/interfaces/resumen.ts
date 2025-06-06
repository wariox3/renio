export interface Resumen {
  cantidad: number
  saldo_pendiente: number
}

export interface RespuestaResumen {
  resumen: Resumen
  vencido: Vencido
  vigente: Vencido
}

export interface Vencido {
  cantidad: number
  saldo_pendiente: number
}

