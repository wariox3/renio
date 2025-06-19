  import { ModuloConfig } from '@interfaces/menu/configuracion.interface';
import { CONTACTO_FILTERS } from '@modulos/general/domain/mapeos/contacto.mapeo';
import { FORMA_PAGO_FILTERS } from '@modulos/general/domain/mapeos/forma-pago.mapeo';
import { ITEM_FILTERS } from '@modulos/general/domain/mapeos/item.mapeo';
import { RESOLUCION_FILTERS } from '@modulos/general/domain/mapeos/resolucion.mapeo';
  import { DOCUMENTO_FILTERS } from 'src/app/core/constants/mapeo/documento.mapeo';

const DocLista = 'compra/documento/lista';
const DocNuevo = 'compra/documento/nuevo';
const DocEditar = 'compra/documento/editar';
const DocDetalle = 'compra/documento/detalle';

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
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle,
            },
            endpoint: 'general/documento',
            queryParams:{
              documento_tipo_id: 5,
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha,-numero,-id'
            },
            configuracionesDocumento: {
              operacion: 1,
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS
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
            id: 1008,
          },
          ajustes: {
            rutas: {
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle,
            },
            endpoint: 'general/documento',
            queryParams:{
              documento_tipo_id: 6,
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha,-numero,-id'
            },
            configuracionesDocumento: {
              operacion: -1,
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS
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
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle,
            },
            endpoint: 'general/documento',
            queryParams:{
              documento_tipo_id: 7,
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha,-numero,-id'
            },
            configuracionesDocumento: {
              operacion: 1,
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS
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
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle,
            },
            endpoint: 'general/documento',
            queryParams:{
              documento_tipo_id: 11,
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha,-numero,-id'
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS
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
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle,
            },
            endpoint: 'general/documento',
            queryParams:{
              documento_tipo_id: 12,
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha,-numero,-id'
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS
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
              detalle: 'compra/administracion/detalle',
            },
            endpoint: 'general/item',
            queryParams: {
              ordering: '-id'
            },
            parametrosHttpConfig: {
              modelo: 'GenItem',
              filtros: {
                ui: ITEM_FILTERS
              },
            },
            archivos: {
              importar: {
                nombre: 'GenItem',
                rutaEjemplo: 'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/GenItem.xlsx',
                verBotonEjemplo: true,
                verBotonImportar: true,
              }
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
              detalle: 'compra/administracion/detalle',
            },
            endpoint: 'general/contacto',
            parametrosHttpConfig: {
              modelo: 'GenContacto',
              filtros: {
                ui: CONTACTO_FILTERS
              },
            },
            archivos: {
              importar: {
                nombre: 'GenContacto',
                rutaEjemplo: 'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/GenContacto.xlsx',
                verBotonEjemplo: true,
                verBotonImportar: true,
              },
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
              detalle: 'compra/administracion/detalle',
            },
            endpoint: 'general/resolucion',
            queryParams: {
              compra: true,
            },
            parametrosHttpConfig: {
              modelo: 'GenResolucion',
              filtros: {
                ui: RESOLUCION_FILTERS
              },
            },
            ui: {
              verBotonImportar: false,
              verBotonNuevo: true,
              verColumnaEditar: true,
            },
          },
        },
        {
          key: 'GenFormaPago',
          nombreModelo: 'FORMAPAGO',
          ajustes: {
            rutas: {
              lista: 'compra/administracion/lista',
              nuevo: 'compra/administracion/nuevo',
              detalle: 'compra/administracion/detalle',
            },
            endpoint: 'general/forma_pago',
            queryParams: {
              ordering: '-id'
            },
            parametrosHttpConfig: {
              modelo: 'GenFormaPago',
              filtros: {
                ui: FORMA_PAGO_FILTERS
              },
            },
            ui: {
              verBotonImportar: false,
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
