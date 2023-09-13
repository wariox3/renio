export interface Listafiltros {
  nombre: string;
  etiqueta: string;
  tipo: ('Texto' | 'Numero' | 'Booleano' | 'Fecha');
}

export interface FiltrosAplicados {
  propiedad: string,
  operador: string,
  valor_1: string,
  valor_2: string,
  visualizarBtnAgregarFiltro: boolean
}
