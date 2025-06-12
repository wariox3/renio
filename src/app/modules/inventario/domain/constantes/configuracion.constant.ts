import { ModuloConfig } from "@interfaces/menu/configuracion.interface";
import { DOCUMENTO_FILTERS } from "src/app/core/constants/mapeo/documento.mapeo";

const DocLista = 'inventario/documento/lista';
const DocNuevo = 'inventario/documento/nuevo';
const DocEditar = 'inventario/documento/editar';
const DocDetalle = 'inventario/documento/detalle';

export const INVENTARIO_CONFIGURACION: ModuloConfig = {
  nombreModulo: 'inventario',
  funcionalidades: [
    {
      nombreFuncionalidad: 'documento',
      isMenuExpanded: true,
      modelos: [
        {
          key: 500,
          nombreModelo: 'ENTRADA',
          // documentacion: {
          //   id: 1019,
          // },
          ajustes: {
            rutas: {
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle,
            },
            endpoint: 'general/documento',
            queryParams:{
              documento_tipo_id: 9,
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
          key: 501,
          nombreModelo: 'SALIDA',
          // documentacion: {
          //   id: 1007,
          // },
          ajustes: {
            rutas: {
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle,
            },
            endpoint: 'general/documento',
            queryParams:{
              documento_tipo_id: 10,
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
              lista: 'inventario/administracion/lista',
              nuevo: 'inventario/administracion/nuevo',
              detalle: 'inventario/administracion/detalle',
            },
            endpoint: 'general/item',
            parametrosHttpConfig: {
              modelo: 'GenItem',
            },
            archivos: {
              importar: {
                nombre: 'GenItem',
                rutaEjemplo: 'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/GenItem.xlsx',
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
          ajustes: {
            rutas: {
              lista: 'inventario/administracion/lista',
              nuevo: 'inventario/administracion/nuevo',
              detalle: 'inventario/administracion/detalle',
            },
            endpoint: 'general/almacen',
            queryParams: {
              ordering: '-id'
            },
            parametrosHttpConfig: {
              modelo: 'InvAlmacen',
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
          nombreModelo: 'EXISTENCIA',
          ajustes: {
            rutas: {
              lista: 'inventario/informe/existencia',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'HISTORIALMOVIMIENTOS',
          ajustes: {
            rutas: {
              lista: 'inventario/informe/historial_movimientos',
              nuevo: '',
            },
          },
        },
      ],
    },
  ],
};
