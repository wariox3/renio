import { FilterField } from 'src/app/core/interfaces/filtro.interface';
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
  queryParams?: { [key: string]: any };
  parametrosHttpConfig?: ParametrosHttpConfig;
  archivos?: Archivos;
  ui?: OpcionesVista;
  configuracionesDocumento?: {
    operacion ?: 1 | -1;
  };
}

export interface Rutas {
  lista: string;
  nuevo: string;
  detalle?: string;
  editar?: string;
}

export interface Archivos {
  importar: ArchivosImportar;
}

export interface ArchivosImportar {
  nombre: string;
  rutaEjemplo: string;
  verBotonImportar: boolean;
  verBotonEjemplo: boolean;
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
  ui?: FilterField[]
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
