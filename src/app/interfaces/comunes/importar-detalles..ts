export interface ImportarDetalles {
  registros_importados: number
}

export interface ImportarDetallesErrores {
  errores: boolean
  errores_validador: ErroresDato[]
}

export interface ErroresDato {
  fila: number;
  errores: { [key: string]: string[] };
}
