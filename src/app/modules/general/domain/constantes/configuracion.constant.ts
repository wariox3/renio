import { ModuloConfig } from '@interfaces/menu/configuracion.interface';
import { ITEM_FILTERS } from '../mapeos/item.mapeo';
import { CONTACTO_FILTERS } from '../mapeos/contacto.mapeo';
import { SEDE_FILTERS } from '../mapeos/sede.mapeo';
import { CUENTA_BANCO_FILTERS } from '../mapeos/cuenta-banco.mapeo';
import { DOCUMENTO_FILTERS } from 'src/app/core/constants/mapeo/documento.mapeo';

const DocLista = 'general/documento/lista';
const DocNuevo = 'general/documento/nuevo';
const DocEditar = 'general/documento/editar';
const DocDetalle = 'general/documento/detalle';

export const GENERAL_CONFIGURACION: ModuloConfig = {
  nombreModulo: 'inicio',
  funcionalidades: [
    {
      nombreFuncionalidad: 'documento',
      isMenuExpanded: true,
      modelos: [
        {
          key: 100,
          nombreModelo: 'FACTURAVENTA',
          documentacion: {
            id: 1014,
          },
          ajustes: {
            rutas: {
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle,
            },
            endpoint: 'general/documento',
            queryParams: {
              documento_tipo_id: 1,
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha,-numero,-id',
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS,
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
          key: 200,
          nombreModelo: 'PAGO',
          documentacion: {
            id: 1017,
          },
          ajustes: {
            rutas: {
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle,
            },
            endpoint: 'general/documento',
            queryParams: {
              documento_tipo_id: 4,
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha,-numero,-id',
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS,
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
            queryParams: {
              documento_tipo_id: 5,
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha,-numero,-id',
            },
            configuracionesDocumento: {
              operacion: 1,
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS,
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
          key: 400,
          nombreModelo: 'EGRESO',
          documentacion: {
            id: 1012,
          },
          ajustes: {
            rutas: {
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle,
            },
            endpoint: 'general/documento',
            queryParams: {
              documento_tipo_id: 8,
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha,-numero,-id',
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS,
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
          key: 'GenContacto',
          nombreModelo: 'CONTACTO',
          documentacion: {
            id: 1036,
          },
          ajustes: {
            rutas: {
              lista: 'general/administracion/lista',
              nuevo: 'general/administracion/nuevo',
              detalle: 'general/administracion/detalle',
            },
            endpoint: 'general/contacto',
            queryParams: {
              serializador: 'lista',
            },
            parametrosHttpConfig: {
              modelo: 'GenContacto',
              filtros: {
                ui: CONTACTO_FILTERS,
              },
            },
            archivos: {
              importar: {
                nombre: 'GenContacto',
                rutaEjemplo:
                  'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/GenContacto.xlsx',
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
          key: 'GenItem',
          nombreModelo: 'ITEM',
          documentacion: {
            id: 1037,
          },
          ajustes: {
            rutas: {
              lista: 'general/administracion/lista',
              nuevo: 'general/administracion/nuevo',
            },
            endpoint: 'general/item',
            queryParams: {
              ordering: '-id',
            },
            parametrosHttpConfig: {
              modelo: 'GenItem',
              ordenamientos: ['-id'],
              filtros: {
                ui: ITEM_FILTERS,
              },
            },
            archivos: {
              importar: {
                nombre: 'GenItem',
                rutaEjemplo:
                  'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/GenItem.xlsx',
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
          key: 'GenSede',
          nombreModelo: 'SEDE',
          documentacion: {
            id: 1038,
          },
          ajustes: {
            rutas: {
              lista: 'general/administracion/lista',
              nuevo: 'general/administracion/nuevo',
              detalle: 'general/administracion/detalle',
            },
            endpoint: 'general/sede',
            parametrosHttpConfig: {
              modelo: 'GenSede',
              filtros: {
                ui: SEDE_FILTERS,
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
          key: 'GenCuentaBanco',
          nombreModelo: 'CUENTABANCO',
          documentacion: {
            id: 1039,
          },
          ajustes: {
            rutas: {
              lista: 'general/administracion/lista',
              nuevo: 'general/administracion/nuevo',
              detalle: 'general/administracion/detalle',
            },
            endpoint: 'general/cuenta_banco',
            queryParams: {
              ordering: '-id',
            },
            parametrosHttpConfig: {
              modelo: 'GenCuentaBanco',
              ordenamientos: ['id'],
              filtros: {
                ui: CUENTA_BANCO_FILTERS,
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
      nombreFuncionalidad: 'informe',
      modelos: [
        {
          key: null,
          nombreModelo: 'VENTASITEM',
          documentacion: {
            id: 1040,
          },
          ajustes: {
            rutas: {
              lista: 'general/informe/ventas_items',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'CUENTASCOBRAR',
          documentacion: {
            id: 1045,
          },
          ajustes: {
            rutas: {
              lista: 'general/informe/cuentas_cobrar',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'CUENTASPAGAR',
          documentacion: {
            id: 1043,
          },
          ajustes: {
            rutas: {
              lista: 'general/informe/cuentas_pagar',
              nuevo: '',
            },
          },
        },
      ],
    },
  ],
};
