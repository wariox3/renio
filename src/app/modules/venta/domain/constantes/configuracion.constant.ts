import { ModuloConfig } from '@interfaces/menu/configuracion.interface';
import { PEDIDO_CLIENTE_FILTERS } from '../mapeos/pedido-cliente.mapeo';
import { CONTACTO_FILTERS } from '../../../general/domain/mapeos/contacto.mapeo';
import { DOCUMENTO_FILTERS } from 'src/app/core/constants/mapeo/documento.mapeo';
import { ITEM_FILTERS } from '@modulos/general/domain/mapeos/item.mapeo';
import { ALMACEN_FILTERS } from '@modulos/inventario/domain/mapeos/almacen.mapeo';
import { SEDE_FILTERS } from '@modulos/general/domain/mapeos/sede.mapeo';
import { PRECIO_FILTERS } from '@modulos/general/domain/mapeos/precio.mapeo';
import { ASESOR_FILTERS } from '@modulos/general/domain/mapeos/asesor.mapeo';
import { RESOLUCION_FILTERS } from '@modulos/general/domain/mapeos/resolucion.mapeo';
import { CUENTA_BANCO_FILTERS } from '@modulos/general/domain/mapeos/cuenta-banco.mapeo';

const DocLista = 'venta/documento/lista';
const DocNuevo = 'venta/documento/nuevo';
const DocEditar = 'venta/documento/editar';
const DocDetalle = 'venta/documento/detalle';

export const VENTA_CONFIGURACION: ModuloConfig = {
  nombreModulo: 'venta',
  funcionalidades: [
    {
      nombreFuncionalidad: 'documento',
      isMenuExpanded: true,
      modelos: [
        {
          key: 103,
          nombreModelo: 'FACTURARECURRENTE',
          documentacion: {
            id: 1081,
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
              serializador: 'lista',
              documento_tipo_id: 16,
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
              verBotonGenerar: true,
            },
          },
        },
        {
          key: 106,
          nombreModelo: 'PEDIDOCLIENTE',
          documentacion: {
            id: 1069,
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
              serializador: 'lista',
              documento_tipo_id: 26,
              ordering: 'estado_aprobado,-fecha,-numero,-id',
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 106,
                  },
                ],
                ui: PEDIDO_CLIENTE_FILTERS,
              },
            },
            ui: {
              verIconoDerecha: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
              verBotonEliminar: true,
              verColumnaSeleccionar: true,
              verBotonGenerar: true,
            },
          },
        },
        {
          key: 108,
          nombreModelo: 'REMISION',
          documentacion: {
            id: 1083,
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
              documento_tipo_id: 29,
              serializador: 'lista_venta',
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
              verBotonExportarZip: true,
            },
          },
        },
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
              serializador: 'lista_venta',
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
              verBotonExportarZip: true,
              verDropdownNuevo: true,
            },
          },
        },
        {
          key: 105,
          nombreModelo: 'FACTURAPOSELECTRONICA',
          documentacion: {
            id: 1070,
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
              documento_tipo_id: 24,
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
              verBotonExportarZip: true,
            },
          },
        },
        {
          key: 107,
          nombreModelo: 'FACTURAPOS',
          documentacion: {
            id: 1071,
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
              documento_tipo_id: 27,
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
              verBotonExportarZip: true,
            },
          },
        },
        {
          key: 101,
          nombreModelo: 'NOTACREDITO',
          documentacion: {
            id: 1015,
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
              documento_tipo_id: 2,
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
          key: 102,
          nombreModelo: 'NOTADEBITO',
          documentacion: {
            id: 1016,
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
              documento_tipo_id: 3,
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
          key: 104,
          nombreModelo: 'CUENTADECOBRO',
          documentacion: {
            id: 1018,
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
              documento_tipo_id: 17,
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
          nombreModelo: 'Contacto',
          documentacion: {
            id: 1036,
          },
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
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
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/item',
            parametrosHttpConfig: {
              modelo: 'GenItem',
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
          key: 'InvAlmacen',
          nombreModelo: 'Almacen',
          documentacion: {
            id: 1076,
          },
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'inventario/almacen',
            queryParams: {
              ordering: '-id',
            },
            parametrosHttpConfig: {
              modelo: 'InvAlmacen',
              filtros: {
                ui: ALMACEN_FILTERS,
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
          key: 'GenSede',
          nombreModelo: 'Sede',
          documentacion: {
            id: 1038,
          },
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
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
          key: 'GenPrecio',
          nombreModelo: 'PRECIO',
          documentacion: {
            id: 1072,
          },
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/precio',
            queryParams: {
              venta: 'True',
            },
            parametrosHttpConfig: {
              modelo: 'GenPrecio',
              filtros: {
                ui: PRECIO_FILTERS,
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
          key: 'GenAsesor',
          nombreModelo: 'ASESOR',
          documentacion: {
            id: 1073,
          },
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/asesor',
            parametrosHttpConfig: {
              modelo: 'GenAsesor',
              filtros: {
                ui: ASESOR_FILTERS,
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
          key: 'GenResolucion',
          nombreModelo: 'RESOLUCION',
          documentacion: {
            id: 1074,
          },
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/resolucion',
            queryParams: {
              venta: true,
            },
            parametrosHttpConfig: {
              modelo: 'GenResolucion',
              filtros: {
                ui: RESOLUCION_FILTERS,
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
          nombreModelo: 'CuentaBanco',
          documentacion: {
            id: 1039,
          },
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/cuenta_banco',
            queryParams: {
              ordering: 'id',
            },
            parametrosHttpConfig: {
              modelo: 'GenCuentaBanco',
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
      nombreFuncionalidad: 'utilidad',
      modelos: [
        {
          key: null,
          nombreModelo: 'ENVIARFACTURAELECTRONICA',
          documentacion: {
            id: 1075,
          },
          ajustes: {
            rutas: {
              lista: 'venta/utilidad/factura_electronica',
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
          nombreModelo: 'CUENTASCOBRAR',
          documentacion: {
            id: 1045,
          },
          ajustes: {
            rutas: {
              lista: 'venta/informe/cuentas_cobrar',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'VENTASITEM',
          documentacion: {
            id: 1040,
          },
          ajustes: {
            rutas: {
              lista: 'venta/informe/ventas_items',
              nuevo: '',
            },
          },
        },
      ],
    },
  ],
};
