import { ModuloConfig } from "@interfaces/menu/configuracion.interface";

const DocLista = 'tesoreria/documento/lista';
const DocNuevo = 'tesoreria/documento/nuevo';
const DocEditar = 'tesoreria/documento/editar';
const DocDetalle = 'tesoreria/documento/detalle';


export const TESORERIA_CONFIGURACION: ModuloConfig = {
  nombreModulo: 'tesoreria',
  funcionalidades: [
    {
      nombreFuncionalidad: 'documento',
      isMenuExpanded: true,
      modelos: [
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
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 400,
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
          key: 401,
          nombreModelo: 'SALDOINICIAL',
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
            archivos:{
              importar: 'SaldoInicial.xlsx'
            },
            ui: {
              verIconoDerecha: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
              verBotonEliminar: true,
              verColumnaSeleccionar: true,
              verBotonImportar: true
            },
          },
        },
      ],
    },
    {
      nombreFuncionalidad: 'administracion',
      modelos: [
        {
          key: 'GenCuentaBanco',
          nombreModelo: 'CuentaBanco',
          ajustes: {
            rutas: {
              lista: 'tesoreria/administracion/lista',
              nuevo: 'tesoreria/administracion/nuevo',
              detalle: 'tesoreria/administracion/detalle',
            },
            endpoint: 'general/cuenta_banco',
            parametrosHttpConfig: {
              modelo: 'GenCuentaBanco',
              ordenamientos: ['-id'],
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
              lista: 'tesoreria/administracion/lista',
              nuevo: 'tesoreria/administracion/nuevo',
              detalle: 'tesoreria/administracion/detalle',
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
              lista: 'tesoreria/informe/cuentas_pagar',
              nuevo: '',
            },
          },
        },
      ],
    },
  ],
};
