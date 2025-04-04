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
  rutas: Routes;
  endpoint?: string;
  parametrosHttpConfig?: ParametrosHttpConfig;
  archivos?: Importacion;
  ui?: OpcionesVista;
}

export interface Routes {
  lista: string;
  nuevo: string;
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
}

export const COMPRA_CONFIGURACION: ModuloConfig = {
  nombreModulo: 'compra',
  funcionalidades: [
    {
      nombreFuncionalidad: 'documento',
      isMenuExpanded: true,
      modelos: [
        {
          key: 300,
          nombreModelo: 'FACTURACOMPRA',
          documentacion: {
            id: 1007,
          },
          ajustes: {
            rutas: {
              lista: 'compra/documento/lista',
              nuevo: 'compra/documento/nuevo',
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 300,
                  },
                ],
              },
            },
            ui: {
              verIconoDerecha: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
              verBotonEliminar: true,
              verColumnaSeleccionar: true,
            },
          },
        },
        {
          key: 301,
          nombreModelo: 'NOTACREDITO',
          documentacion: {
            id: 1007,
          },
          ajustes: {
            rutas: {
              lista: 'compra/documento/lista',
              nuevo: 'compra/documento/nuevo',
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 301,
                  },
                ],
              },
            },
            ui: {
              verIconoDerecha: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
              verBotonEliminar: true,
              verColumnaSeleccionar: true,
            },
          },
        },
        {
          key: 302,
          nombreModelo: 'NOTADEBITO',
          documentacion: {
            id: 1009,
          },
          ajustes: {
            rutas: {
              lista: 'compra/documento/lista',
              nuevo: 'compra/documento/nuevo',
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 302,
                  },
                ],
              },
            },
            ui: {
              verIconoDerecha: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
              verBotonEliminar: true,
              verColumnaSeleccionar: true,
            },
          },
        },
        {
          key: 303,
          nombreModelo: 'documentoSOPORTE',
          documentacion: {
            id: 1010,
          },
          ajustes: {
            rutas: {
              lista: 'compra/documento/lista',
              nuevo: 'compra/documento/nuevo',
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 303,
                  },
                ],
              },
            },
            ui: {
              verIconoDerecha: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
              verBotonEliminar: true,
              verColumnaSeleccionar: true,
            },
          },
        },
        {
          key: 304,
          nombreModelo: 'NOTAAJUSTE',
          documentacion: {
            id: 1011,
          },
          ajustes: {
            rutas: {
              lista: 'compra/documento/lista',
              nuevo: 'compra/documento/nuevo',
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 304,
                  },
                ],
              },
            },
            ui: {
              verIconoDerecha: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
              verBotonEliminar: true,
              verColumnaSeleccionar: true,
            },
          },
        },
      ],
    },
    {
      nombreFuncionalidad: 'administracion',
      modelos: [
        {
          key: 'GenItem',
          nombreModelo: 'Item',
          ajustes: {
            rutas: {
              lista: 'compra/administracion/lista',
              nuevo: 'compra/administracion/nuevo',
            },
            endpoint: 'general/item',
            parametrosHttpConfig: {
              modelo: 'GenItem',
              ordenamientos: ['-id'],
            },
            archivos: {
              importar: 'GenItem.xlsx',
            },
            ui: {
              verBotonImportar: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
            },
          },
        },
        {
          key: 'GenContacto',
          nombreModelo: 'Contacto',
          ajustes: {
            rutas: {
              lista: 'compra/administracion/lista',
              nuevo: 'compra/administracion/nuevo',
            },
            endpoint: 'general/contacto',
            parametrosHttpConfig: {
              modelo: 'GenContacto',
            },
            archivos: {
              importar: 'GenContacto.xlsx',
            },
            ui: {
              verBotonImportar: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
            },
          },
        },
        {
          key: 'GenResolucion',
          nombreModelo: 'RESOLUCION',
          ajustes: {
            rutas: {
              lista: 'compra/administracion/lista',
              nuevo: 'compra/administracion/nuevo',
            },
            endpoint: 'general/resolucion',
            parametrosHttpConfig: {
              modelo: 'GenResolucion',
              ordenamientos: ['-id'],
            },
            archivos: {
              importar: 'GenContacto.xlsx',
            },
            ui: {
              verBotonImportar: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
            },
          },
        },
        // {
        //   nombre: 'RESOLUCION',
        //   modelo: 'GenResolucion',
        //   tipo: 'administrador',
        //   modulo: 'compra',
        //   data: { resoluciontipo: 'compra' },
        //   rutas: 'compra/administracion',
        // },
        {
          key: 'GenFormaPago',
          nombreModelo: 'FORMAPAGO',
          ajustes: {
            rutas: {
              lista: 'compra/administracion/lista',
              nuevo: 'compra/administracion/nuevo',
            },
            endpoint: 'general/forma_pago',
            parametrosHttpConfig: {
              modelo: 'GenFormaPago',
              ordenamientos: ['id'],
            },
            ui: {
              verBotonImportar: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
            },
          },
        },
      ],
    },
    {
      nombreFuncionalidad: 'utilidad',
      modelos: [
        {
          key: null,
          nombreModelo: 'documentoELECTRONICO',
          ajustes: {
            rutas: {
              lista: 'compra/utilidad/documento_electronico',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'EVENTOSDIAN',
          ajustes: {
            rutas: {
              lista: 'compra/utilidad/eventos_dian',
              nuevo: '',
            },
          },
        },
      ],
    },
    {
      nombreFuncionalidad: 'informe',
      modelos: [
        {
          key: null,
          nombreModelo: 'CUENTASPAGAR',
          ajustes: {
            rutas: {
              lista: 'compra/informe/cuentas_pagar',
              nuevo: '',
            },
          },
        },
      ],
    },
  ],
};
