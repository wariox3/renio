export interface Listafiltros {
  nombre: string;
  etiqueta: string;
  tipo: ('Texto' | 'Numero' | 'Booleano' | 'Fecha');
}

export interface FiltrosAplicados {
  propiedad: string,
  operador: string,
  valor1: string,
  valor2: string,
  visualizarBtnAgregarFiltro: boolean
}
