import { ModuloConfig } from "@interfaces/menu/configuracion.interface";
import { CONTACTO_FILTERS } from "@modulos/general/domain/mapeos/contacto.mapeo";
import { CUENTA_BANCO_FILTERS } from "@modulos/general/domain/mapeos/cuenta-banco.mapeo";
import { DOCUMENTO_FILTERS } from "src/app/core/constants/mapeo/documento.mapeo";

const DocLista = 'cartera/documento/lista';
const DocNuevo = 'cartera/documento/nuevo';
const DocEditar = 'cartera/documento/editar';
const DocDetalle = 'cartera/documento/detalle';

export const CARTERA_CONFIGURACION: ModuloConfig = {
  nombreModulo: 'cartera',
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
              lista: DocLista,
              nuevo: DocNuevo,
              editar: DocEditar,
              detalle: DocDetalle,
            },
            endpoint: 'general/documento',
            queryParams:{
              documento_tipo_id: 4,
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
          key: 201,
          nombreModelo: 'SALDOINICIAL',
           documentacion: {
             id: 1044,
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
              documento_tipo_id: 18,
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha,-numero,-id'
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS  
              },
            },
            archivos: {
              importar: {
                nombre: 'SaldoInicial',
                rutaEjemplo: 'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/SaldoInicial.xlsx',
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
          documentacion: {
            id: 1039,
          },
          ajustes: {
            rutas: {
              lista: 'cartera/administracion/lista',
              nuevo: 'cartera/administracion/nuevo',
              detalle: 'cartera/administracion/detalle',
            },
            endpoint: 'general/cuenta_banco',
            queryParams: {
              ordering: '-id'
            },
            parametrosHttpConfig: {
              modelo: 'GenCuentaBanco',
              filtros: {
                ui: CUENTA_BANCO_FILTERS
              }
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
          documentacion: {
            id: 1036,
          },
          nombreModelo: 'Contacto',
          ajustes: {
            rutas: {
              lista: 'cartera/administracion/lista',
              nuevo: 'cartera/administracion/nuevo',
              detalle: 'cartera/administracion/detalle',
            },
            endpoint: 'general/contacto',
            parametrosHttpConfig: {
              modelo: 'GenContacto',
              filtros: {
                ui: CONTACTO_FILTERS
              }
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
              lista: 'cartera/informe/cuentas_cobrar',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'CUENTASCOBRARCORTE',
          documentacion: {
            id: 1046,
          },
          ajustes: {
            rutas: {
              lista: 'cartera/informe/cuentas_cobrar_corte',
              nuevo: '',
            },
          },
        },
      ],
    },
  ],
};
