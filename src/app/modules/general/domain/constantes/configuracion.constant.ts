import { ModuloConfig } from '@interfaces/menu/configuracion.interface';

const DocLista = 'general/documento/lista';
const DocNuevo = 'general/documento/nuevo';
const DocEditar = 'general/documento/editar';
const DocDetalle = 'general/documento/detalle';

export const GENERAL_CONFIGURACION: ModuloConfig = {
  nombreModulo: 'general',
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
      ],
    },
    {
      nombreFuncionalidad: 'administracion',
      modelos: [
        {
          key: 'GenContacto',
          nombreModelo: 'CONTACTO',
          ajustes: {
            rutas: {
              lista: 'general/administracion/lista',
              nuevo: 'general/administracion/nuevo',
              detalle: 'general/administracion/detalle',
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
              lista: 'general/administracion/lista',
              nuevo: 'general/administracion/nuevo',
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
          key: 'GenSede',
          nombreModelo: 'SEDE',
          ajustes: {
            rutas: {
              lista: 'general/administracion/lista',
              nuevo: 'general/administracion/nuevo',
              detalle: 'general/administracion/detalle',
            },
            endpoint: 'general/sede',
            parametrosHttpConfig: {
              modelo: 'GenSede',
            },
            ui: {
              verBotonNuevo: true,
              verColumnaEditar: true,
            },
          },
        },
        {
          key: 'GenCuentaBanco',
          nombreModelo: 'CUENTABANCO',
          ajustes: {
            rutas: {
              lista: 'general/administracion/lista',
              nuevo: 'general/administracion/nuevo',
              detalle: 'general/administracion/detalle',
            },
            endpoint: 'general/cuenta_banco',
            parametrosHttpConfig: {
              modelo: 'GenCuentaBanco',
              ordenamientos: ['id'],
            },
            ui: {
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
          ajustes: {
            rutas: {
              lista: 'general/informe/cuentas_cobrar',
              nuevo: '',
            },
          },
        },
      ],
    },
  ],
};
