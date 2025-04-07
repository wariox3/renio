import { ModuloConfig } from '@interfaces/menu/configuracion.interface';

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
            endpoint: 'general/documento',
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
            endpoint: 'general/documento',
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
      isMenuExpanded: true,
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
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 701,
                  },
                ],
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
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              serializador: 'Nomina',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 702,
                  },
                ],
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
            parametrosHttpConfig: {
              modelo: 'GenDocumento',
              ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
              filtros: {
                lista: [
                  {
                    propiedad: 'documento_tipo__documento_clase_id',
                    valor1: 703,
                  },
                ],
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
            },
            endpoint: 'general/contacto',
            parametrosHttpConfig: {
              modelo: 'GenContacto',
              ordenamientos: ['-id'],
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
          key: 'HumContrato',
          nombreModelo: 'CONTRATO',
          ajustes: {
            rutas: {
              lista: 'compra/administracion/lista',
              nuevo: 'compra/administracion/nuevo',
            },
            endpoint: 'humano/contrato',
            parametrosHttpConfig: {
              modelo: 'HumContrato',
              ordenamientos: ['-id'],
            },
            archivos: {
              importar: 'HumContrato.xlsx',
            },
            ui: {
              verBotonImportar: true,
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
            },
            endpoint: 'humano/grupo',
            parametrosHttpConfig: {
              modelo: 'HumGrupo',
            },
            ui: {
              verBotonImportar: true,
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
            },
            endpoint: 'humano/sucursal',
            parametrosHttpConfig: {
              modelo: 'HumSucursal',
            },
            ui: {
              verBotonImportar: true,
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
