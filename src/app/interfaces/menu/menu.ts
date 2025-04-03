import { AplicacionModulo } from '@comun/type/aplicacion-modulo.type';
import { AplicacionAccion } from '@comun/type/aplicaciones-acciones.type';
import { AplicacionUbicaciones } from '@comun/type/aplicaciones-ubicaciones.type';
import { ArchivoImportacion } from '@interfaces/comunes/importar/archivo-importacion';
export interface Menu {
  name?: string;
  url?: string;
  icon?: string;
  children?: Menu[];
}

interface Filtro {
  propiedad: string;
  valor1: boolean;
}

export interface informacionMenuItem {
  nombre: string;
  modelo?: string;
  documentacionId?: number;
  archivoImportacionLista?: string;
  archivoImportacionNuevo?: string;
  archivoImportacionDetalle?: string;
  tipo?: AplicacionUbicaciones;
  url?: string;
  urlIndependientes?: {
    lista?: string;
    nuevo?: string;
    detalle?: string;
  };
  menuOpen?: boolean;
  visualiazarIconoDeracha?: boolean;
  consultaHttp?: boolean;
  configuracionExtra?: boolean;
  esIndependiente?: boolean;
  modulo?: AplicacionModulo;
  maestros?: Maestros[];
  data?: {
    documento_clase?: number | string;
    ordenamiento?: string;
    importarSoloNuevos?: string;
    filtrosLista?: Filtro[];
    filtrosImportar?: Filtro[];
    modelo?: string;
    visualizarColumnaEditar?: string;
    visualizarBtnNuevo?: string;
    visualizarBtnEliminar?: string;
    visualizarColumnaSeleccionar?: string;
    visualizarBtnImportar?: string;
    visualizarBtnExportarExcel?: string;
    visualizarBtnExportarZip?: string;
    resoluciontipo?: string;
    serializador?: string;
    submodelo?: string;
    dataPersonalizada?: string;
    detalle?: string;
    parametro?: string;
  };
  children?: informacionMenuItem[];
}

export interface Maestros {
  endpoint: string;
  name: string;
}

export interface MenuItem {
  seleccion: string;
  informacion: informacionMenuItem[];
  dataMapeo: any[];
  dataItem: informacionMenuItem;
  modulos: AplicacionModulo[];
}
