export interface Listafiltros {
  valor: string;
  tipo: ('Texto' | 'Numero' | 'Booleano' | 'Fecha');
}

export interface FiltrosAplicados {
  propiedad: string,
  criterio: string,
  busqueda: string,
  entre: string
}
