import { ModuloConfig } from '@interfaces/menu/configuracion.interface';
import { CONTACTO_FILTERS } from '@modulos/general/domain/mapeos/contacto.mapeo';
import { DOCUMENTO_FILTERS } from 'src/app/core/constants/mapeo/documento.mapeo';
import { CONTRATO_FILTERS } from '../mapeo/contrato.mapeo';
import { CARGO_FILTERS } from '../mapeo/cargo.mapeo';
import { GRUPO_FILTERS } from '../mapeo/grupo.mapeo';
import { SUCURSAL_FILTERS } from '../mapeo/sucursal.mapeo';
import { ADICIONAL_FILTERS } from '../mapeo/adicional.mapeo';
import { CREDITO_FILTERS } from '../mapeo/credito.mapeo';
import { NOVEDAD_FILTERS } from '../mapeo/novedad.mapeo';
import { LIQUIDACION_FILTERS } from '../mapeo/liquidacion.mapeo';

const DocLista = 'humano/documento/lista';
const DocNuevo = 'humano/documento/nuevo';
const DocEditar = 'humano/documento/editar';
const DocDetalle = 'humano/documento/detalle';

export const HUMANO_CONFIGURACION: ModuloConfig = {
  nombreModulo: 'humano',
  funcionalidades: [
    {
      nombreFuncionalidad: 'proceso',
      isMenuExpanded: true,
      modelos: [
        {
          key: 'HumProgramacion',
          nombreModelo: 'PROGRAMACION',
          ajustes: {
            rutas: {
              lista: 'humano/proceso/lista',
              nuevo: 'humano/proceso/nuevo',
              detalle: 'humano/proceso/detalle',
              editar: 'humano/proceso/editar',
            },
            endpoint: 'humano/programacion',
            queryParams: {
              ordering: '-fecha_desde',
            },
            parametrosHttpConfig: {
              modelo: 'HumProgramacion',
            },
            ui: {
              verBotonEliminar: true,
              verBotonNuevo: true,
              verColumnaSeleccionar: true,
              verBotonExportarZip: true,
              verColumnaEditar: true,
              verIconoDerecha: true,
            },
          },
        },
        {
          key: 'HumAporte',
          nombreModelo: 'seguridadSocial',
          ajustes: {
            rutas: {
              lista: 'humano/proceso/lista',
              nuevo: 'humano/proceso/nuevo',
              detalle: 'humano/proceso/detalle',
              editar: 'humano/proceso/editar',
            },
            endpoint: 'humano/aporte',
            queryParams: {
              ordering: '-fecha_desde',
            },
            parametrosHttpConfig: {
              modelo: 'HumAporte',
            },
            ui: {
              verBotonEliminar: true,
              verBotonNuevo: true,
              verColumnaSeleccionar: true,
              verBotonExportarZip: true,
              verColumnaEditar: true,
              verIconoDerecha: true,
            },
          },
        },
        {
          key: 'HumLiquidacion',
          nombreModelo: 'liquidacion',
          ajustes: {
            rutas: {
              lista: 'humano/proceso/lista',
              nuevo: 'humano/proceso/nuevo',
              detalle: 'humano/proceso/detalle',
              editar: 'humano/proceso/editar',
            },
            endpoint: 'humano/liquidacion',
            queryParams: {
              serializador: 'lista',
              ordering: 'estado_aprobado,-fecha_hasta,-numero,-id',
            },
            parametrosHttpConfig: {
              modelo: 'HumLiquidacion',
              filtros: {
                ui: LIQUIDACION_FILTERS
              }
            },
            ui: {
              verBotonEliminar: true,
              verBotonNuevo: false,
              verColumnaSeleccionar: true,
              verBotonExportarZip: true,
              verColumnaEditar: false,
              verIconoDerecha: true,
            },
          },
        },
      ],
    },
    {
      nombreFuncionalidad: 'documento',
      modelos: [
        {
          key: 701,
          nombreModelo: 'NOMINA',
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
              serializador: 'lista_nomina',
              documento_tipo__documento_clase_id: 701,
              ordering: 'estado_aprobado,-fecha,-numero,-id'
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS
              },
            },
            ui: {
              verBotonEliminar: true,
              verColumnaSeleccionar: true,
              verBotonExportarZip: true,
            },
          },
        },
        {
          key: 702,
          nombreModelo: 'NOMINAELECTRONICA',
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
              serializador: 'lista_nomina',
              documento_tipo_id: 15,
              ordering: 'estado_aprobado,-fecha,-numero,-id'
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS
              },
            },
            ui: {
              verBotonEliminar: true,
              verColumnaSeleccionar: true,
              verBotonExportarZip: true,
              verBotonGenerar: true //Esto actualmente es configuracionExtra en el menu reducer
            },
          },
        },
        {
          key: 703,
          nombreModelo: 'SEGURIDADSOCIAL',
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
              serializador: 'lista_nomina',
              documento_tipo_id: 22,
              ordering: 'estado_aprobado,-fecha,-numero,-id'
            },
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              filtros: {
                ui: DOCUMENTO_FILTERS
              },
            },
            ui: {
              verBotonEliminar: true,
              verColumnaSeleccionar: true,
              verBotonExportarZip: true,
            },
          },
        },
      ],
    },
    {
      nombreFuncionalidad: 'administracion',
      modelos: [
        {
          key: 'GenEmpleado',
          nombreModelo: 'EMPLEADO',
          ajustes: {
            rutas: {
              lista: 'humano/administracion/lista',
              nuevo: 'humano/administracion/nuevo',
              detalle: 'humano/administracion/detalle',
            },
            endpoint: 'general/contacto',
            queryParams: {
              ordering: '-id',
              empleado: true,
            },
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
          key: 'HumContrato',
          nombreModelo: 'CONTRATO',
          ajustes: {
            rutas: {
              lista: 'humano/administracion/lista',
              nuevo: 'humano/administracion/nuevo',
              detalle: 'humano/administracion/detalle',
            },
            endpoint: 'humano/contrato',
            queryParams: {
              ordering: '-id',
              serializador: 'lista'
            },
            parametrosHttpConfig: {
              modelo: 'HumContrato',
              filtros: {
                ui: CONTRATO_FILTERS
              }
            },
            archivos: {
              importar: {
                nombre: 'HumContrato',
                rutaEjemplo: 'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/HumContrato.xlsx',
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
          key: 'HumCargo',
          nombreModelo: 'CARGO',
          ajustes: {
            rutas: {
              lista: 'humano/administracion/lista',
              nuevo: 'humano/administracion/nuevo',
              detalle: 'humano/administracion/detalle',
            },
            endpoint: 'humano/cargo',
            queryParams: {
              ordering: '-id',
            },
            parametrosHttpConfig: {
              modelo: 'HumCargo',
              filtros: {
                ui: CARGO_FILTERS
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
          key: 'HumGrupo',
          nombreModelo: 'GRUPO',
          ajustes: {
            rutas: {
              lista: 'humano/administracion/lista',
              nuevo: 'humano/administracion/nuevo',
              detalle: 'humano/administracion/detalle',
            },
            endpoint: 'humano/grupo',
            parametrosHttpConfig: {
              modelo: 'HumGrupo',
              filtros: {
                ui: GRUPO_FILTERS
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
          key: 'HumSucursal',
          nombreModelo: 'SUCURSAL',
          ajustes: {
            rutas: {
              lista: 'humano/administracion/lista',
              nuevo: 'humano/administracion/nuevo',
              detalle: 'humano/administracion/detalle',
            },
            endpoint: 'humano/sucursal',
            parametrosHttpConfig: {
              modelo: 'HumSucursal',
              filtros: {
                ui: SUCURSAL_FILTERS
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
          key: 'HumAdicional',
          nombreModelo: 'ADICIONAL',
          ajustes: {
            rutas: {
              lista: 'humano/administracion/lista',
              nuevo: 'humano/administracion/nuevo',
              detalle: 'humano/administracion/detalle',
            },
            endpoint: 'humano/adicional',
            queryParams: {
              ordering: '-id',
              permanente: true,
            },
            parametrosHttpConfig: {
              modelo: 'HumAdicional',
              filtros: {
                importar: [
                  {
                    propiedad: 'permanente',
                    valor1: true,
                  },
                ],
                ui: ADICIONAL_FILTERS
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
          key: 'HumCredito',
          nombreModelo: 'CREDITO',
          ajustes: {
            rutas: {
              lista: 'humano/administracion/lista',
              nuevo: 'humano/administracion/nuevo',
              detalle: 'humano/administracion/detalle',
            },
            endpoint: 'humano/credito',
            queryParams: {
              ordering: '-id'
            },
            parametrosHttpConfig: {
              modelo: 'HumCredito',
              filtros: {
                ui: CREDITO_FILTERS
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
          key: 'HumNovedad',
          nombreModelo: 'NOVEDAD',
          ajustes: {
            rutas: {
              lista: 'humano/administracion/lista',
              nuevo: 'humano/administracion/nuevo',
              detalle: 'humano/administracion/detalle',
            },
            endpoint: 'humano/novedad',
            queryParams: {
              ordering: '-id'
            },
            parametrosHttpConfig: {
              modelo: 'HumNovedad',
              filtros: {
                ui: NOVEDAD_FILTERS
              }
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
          nombreModelo: 'ENVIANOMINAELECTRONICA',
          ajustes: {
            rutas: {
              lista: 'humano/utilidad/enviar_nomina_electronica',
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
          nombreModelo: 'NOMINA',
          ajustes: {
            rutas: {
              lista: 'humano/informe/nomina',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'NOMINADETALLE',
          ajustes: {
            rutas: {
              lista: 'humano/informe/nomina_detalle',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'NOMINAELECTRONICA',
          ajustes: {
            rutas: {
              lista: 'humano/informe/nomina_electronica',
              nuevo: '',
            },
          },
        },
      ],
    },
  ],
};
