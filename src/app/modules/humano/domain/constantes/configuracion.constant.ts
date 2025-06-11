import { ModuloConfig } from '@interfaces/menu/configuracion.interface';
import { DOCUMENTO_FILTERS } from 'src/app/core/constants/mapeo/documento.mapeo';

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
            parametrosHttpConfig: {
              modelo: 'HumProgramacion',
              ordenamientos: ['-fecha_desde'],
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
            parametrosHttpConfig: {
              modelo: 'HumAporte',
              ordenamientos: ['-fecha_desde'],
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
            parametrosHttpConfig: {
              modelo: 'GenContacto',
              filtros: {
                lista: [
                  {
                    propiedad: 'empleado',
                    valor1: true,
                  },
                ],
              },
              ordenamientos: ['-id'],
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
            parametrosHttpConfig: {
              modelo: 'HumContrato',
              ordenamientos: ['-id'],
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
            parametrosHttpConfig: {
              modelo: 'HumCargo',
              ordenamientos: ['-id'],
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
            parametrosHttpConfig: {
              modelo: 'HumAdicional',
              ordenamientos: ['-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'permanente',
                    valor1: true,
                  },
                ],
                importar: [
                  {
                    propiedad: 'permanente',
                    valor1: true,
                  },
                ],
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
            parametrosHttpConfig: {
              modelo: 'HumCredito',
              ordenamientos: ['-id'],
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
            parametrosHttpConfig: {
              modelo: 'HumNovedad',
              ordenamientos: ['-id'],
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
