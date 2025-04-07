import { ModuloConfig } from "@interfaces/menu/configuracion.interface";

export const CARTERA_CONFIGURACION: ModuloConfig = {
  nombreModulo: 'compra',
  funcionalidades: [
    {
      nombreFuncionalidad: 'documento',
      isMenuExpanded: true,
      modelos: [
        {
          key: 200,
          nombreModelo: 'PAGO',
          documentacion: {
            id: 1019,
          },
          ajustes: {
            rutas: {
              lista: 'cartera/documento/lista',
              nuevo: 'cartera/documento/nuevo',
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
          key: 201,
          nombreModelo: 'SALDOINICIAL',
          // documentacion: {
          //   id: 1007,
          // },
          ajustes: {
            rutas: {
              lista: 'cartera/documento/lista',
              nuevo: 'cartera/documento/nuevo',
            },
            endpoint: 'general/documento',
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 201,
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
              lista: 'cartera/administracion/lista',
              nuevo: 'cartera/administracion/nuevo',
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
              lista: 'cartera/administracion/lista',
              nuevo: 'cartera/administracion/nuevo',
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
          nombreModelo: 'CUENTASCOBRAR',
          ajustes: {
            rutas: {
              lista: 'cartera/informe/cuentas_cobrar',
              nuevo: '',
            },
          },
        },
      ],
    },
  ],
};
