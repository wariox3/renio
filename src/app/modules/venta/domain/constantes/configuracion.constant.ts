import { ModuloConfig } from '@interfaces/menu/configuracion.interface';

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
            id: 1013,
          },
          ajustes: {
            rutas: {
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 103,
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
              detalle: DocDetalle
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 100,
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
              verBotonExportarZip: true,
            },
          },
        },
        {
          key: 105,
          nombreModelo: 'FACTURAPOS',
          documentacion: {
            id: 1009,
          },
          ajustes: {
            rutas: {
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 105,
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
              detalle: DocDetalle
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 101,
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
              detalle: DocDetalle
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 102,
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
              detalle: DocDetalle
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 200,
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
              detalle: DocDetalle
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 104,
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
          key: 'GenContacto',
          nombreModelo: 'Contacto',
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
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
          key: 'GenItem',
          nombreModelo: 'ITEM',
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/item',
            parametrosHttpConfig: {
              modelo: 'GenItem',
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
          key: 'InvAlmacen',
          nombreModelo: 'Almacen',
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/precio',
            parametrosHttpConfig: {
              modelo: 'InvAlmacen',
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
          nombreModelo: 'Sede',
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/sede',
            parametrosHttpConfig: {
              modelo: 'GenSede',
            },
            ui: {
              verBotonImportar: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
            },
          },
        },
        {
          key: 'GenPrecio',
          nombreModelo: 'PRECIO',
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/precio',
            parametrosHttpConfig: {
              modelo: 'GenPrecio',
            },
            ui: {
              verBotonImportar: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
            },
          },
        },
        {
          key: 'GenAsesor',
          nombreModelo: 'ASESOR',
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/asesor',
            parametrosHttpConfig: {
              modelo: 'GenAsesor',
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
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/resolucion',
            parametrosHttpConfig: {
              modelo: 'GenResolucion',
              filtros: {
                lista: [
                  {
                    propiedad: 'venta',
                    valor1: true,
                  },
                ],
              },
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
          key: 'GenCuentaBanco',
          nombreModelo: 'CuentaBanco',
          ajustes: {
            rutas: {
              lista: 'venta/administracion/lista',
              nuevo: 'venta/administracion/nuevo',
              detalle: 'venta/administracion/detalle',
            },
            endpoint: 'general/cuenta_banco',
            parametrosHttpConfig: {
              modelo: 'GenCuentaBanco',
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
          nombreModelo: 'FACTURAELECTRONICA',
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
          nombreModelo: 'VENTASITEM',
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
