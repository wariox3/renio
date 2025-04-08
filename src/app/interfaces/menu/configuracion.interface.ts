import { Modelo } from '@comun/type/modelo.type';
import { Serializador } from '@comun/type/serializador.type';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';

export interface ModuloConfig {
  nombreModulo: string;
  funcionalidades: FuncionalidadConfig[];
}

export interface FuncionalidadConfig {
  nombreFuncionalidad: string;
  esIndependiente?: boolean;
  isMenuExpanded?: boolean;
  modelos: ModeloConfig[];
}

export interface ModeloConfig {
  nombreModelo: string;
  key: Modelo | number | null;
  documentacion?: ModeloDocumentacion;
  ajustes: ModeloAjustes;
}

export interface ModeloAjustes {
  rutas: Rutas;
  endpoint?: string;
  parametrosHttpConfig?: ParametrosHttpConfig;
  archivos?: Importacion;
  ui?: OpcionesVista;
}

export interface Rutas {
  lista: string;
  nuevo: string;
  detalle?: string;
  editar?: string;
}

export interface Importacion {
  importar: string;
}

export interface ModeloDocumentacion {
  id: number;
}

export interface ParametrosHttpConfig {
  modelo: Modelo;
  ordenamientos?: string[];
  serializador?: Serializador;
  filtros?: ModeloFiltro;
}

export interface ModeloFiltro {
  lista?: Filtros[];
  importar?: Filtros[];
}

export interface OpcionesVista {
  verColumnaEditar?: boolean;
  verBotonNuevo?: boolean;
  verBotonEliminar?: boolean;
  verColumnaSeleccionar?: boolean;
  verBotonImportar?: boolean;
  verBotonExportarExcel?: boolean;
  verBotonExportarZip?: boolean;
  verIconoDerecha?: boolean;
  verBotonGenerar?: boolean;
}
