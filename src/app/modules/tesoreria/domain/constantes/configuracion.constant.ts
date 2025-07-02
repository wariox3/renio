import { ModuloConfig } from '@interfaces/menu/configuracion.interface';
import { CONTACTO_FILTERS } from '@modulos/general/domain/mapeos/contacto.mapeo';
import { CUENTA_BANCO_FILTERS } from '@modulos/general/domain/mapeos/cuenta-banco.mapeo';
import { DOCUMENTO_FILTERS } from 'src/app/core/constants/mapeo/documento.mapeo';

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
        {
          key: 401,
          nombreModelo: 'SALDOINICIAL',
          documentacion: {
            id: 1042,
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
              documento_tipo_id: 19,
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha,-numero,-id',
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS,
              },
            },
            archivos: {
              importar: {
                nombre: 'SaldoInicial',
                rutaEjemplo:
                  'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/SaldoInicial.xlsx',
                verBotonEjemplo: true,
                verBotonImportar: true,
              },
            },
            ui: {
              verIconoDerecha: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
              verBotonEliminar: true,
              verColumnaSeleccionar: true,
              verBotonImportar: true,
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
          documentacion: {
            id: 1039,
          },
          ajustes: {
            rutas: {
              lista: 'tesoreria/administracion/lista',
              nuevo: 'tesoreria/administracion/nuevo',
              detalle: 'tesoreria/administracion/detalle',
            },
            endpoint: 'general/cuenta_banco',
            queryParams: {
              ordering: '-id',
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
        {
          key: 'GenContacto',
          nombreModelo: 'Contacto',
          documentacion: {
            id: 1036,
          },
          ajustes: {
            rutas: {
              lista: 'tesoreria/administracion/lista',
              nuevo: 'tesoreria/administracion/nuevo',
              detalle: 'tesoreria/administracion/detalle',
            },
            endpoint: 'general/contacto',
            queryParams: {
              serializador: 'lista'
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
      ],
    },
    {
      nombreFuncionalidad: 'informe',
      modelos: [
        {
          key: null,
          nombreModelo: 'CUENTASPAGAR',
          documentacion: {
            id: 1043,
          },
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
