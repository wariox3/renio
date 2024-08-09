export interface ImportarDetalles {
  registros_importados: number
}

export interface ImportarDetallesErrores {
  errores: boolean
  errores_datos: ErroresDato[]
}

export interface ErroresDato {
  fila: number
  Mensaje: string
}
