export interface Listafiltros {
  nombre: string;
  etiqueta: string;
  titulo: string;
  tipo: 'Texto' | 'Numero' | 'Booleano' | 'Fecha';
}

export interface FiltrosAplicados extends Filtros {  
  visualizarBtnAgregarFiltro?: boolean;
}

export interface Filtros {
  propiedad: string;
  operador: string;
  valor1: string;
  valor2: string;
}

export interface ParametrosFiltros {
  limite: number;
  desplazar: number;
  ordenamientos: string[];
  limite_conteo: number;
  modelo: Modelo;
  serializador: Serializador;
  filtros: FiltrosAplicados[];
}

type Serializador =
  | 'ListaBuscar'
  | 'ListaAutocompletar'
  | 'Informe'
  | 'Referencia'
  | 'EventoCompra'
  | 'Excel'
  | 'NominaExcel'
  | 'Nomina'
  | 'Adicionar';

type Modelo =
  | 'GenDocumento'
  | 'GenCiudad'
  | 'GenIdentificacion'
  | 'GenRegimen'
  | 'GenTipoPersona'
  | 'GenPrecio'
  | 'GenMetodoPago'
  | 'GenAsesor'
  | 'GenPlazoPago'
  | 'GenBanco'
  | 'GenCuentaBancoClase'
  | 'HumPeriodo'
  | 'HumConcepto'
  | 'HumAdicional'
  | 'HumProgramacionDetalle'
  | 'HumContrato';
