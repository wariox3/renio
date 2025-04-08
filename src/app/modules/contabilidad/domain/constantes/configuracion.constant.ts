import { ModuloConfig } from '@interfaces/menu/configuracion.interface';

const DocLista = 'contabilidad/documento/lista';
const DocNuevo = 'contabilidad/documento/nuevo';
const DocEditar = 'contabilidad/documento/editar';
const DocDetalle = 'contabilidad/documento/detalle';

export const CONTABILIDAD_CONFIGURACION: ModuloConfig = {
  nombreModulo: 'contabilidad',
  funcionalidades: [
    {
      nombreFuncionalidad: 'especial',
      modelos: [
        {
          key: null,
          nombreModelo: 'PERIODO',
          ajustes: {
            rutas: {
              lista: 'contabilidad/especial/periodo',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'MOVIMIENTO',
          ajustes: {
            rutas: {
              lista: 'contabilidad/especial/movimiento',
              nuevo: '',
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
          key: 601,
          nombreModelo: 'ASIENTO',
          documentacion: {
            id: 1020,
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
                    valor1: 601,
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
          key: 602,
          nombreModelo: 'DEPRECIACION',
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
                    valor1: 602,
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
          key: 603,
          nombreModelo: 'CIERRE',
          documentacion: {
            id: 1020,
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
                    valor1: 602,
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
              lista: 'contabilidad/administracion/lista',
              nuevo: 'contabilidad/administracion/nuevo',
              detalle: 'contabilidad/administracion/detalle',
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
          key: 'ConCuenta',
          nombreModelo: 'CUENTA',
          ajustes: {
            rutas: {
              lista: 'contabilidad/administracion/lista',
              nuevo: 'contabilidad/administracion/nuevo',
              detalle: 'contabilidad/administracion/detalle',
            },
            endpoint: 'contabilidad/cuenta',
            parametrosHttpConfig: {
              modelo: 'ConCuenta',
              ordenamientos: ['codigo'],
            },
            archivos: {
              importar: 'ConCuenta.xlsx',
            },
            ui: {
              verBotonImportar: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
            },
          },
        },
        {
          key: 'ConGrupo',
          nombreModelo: 'GRUPO',
          ajustes: {
            rutas: {
              lista: 'contabilidad/administracion/lista',
              nuevo: 'contabilidad/administracion/nuevo',
              detalle: 'contabilidad/administracion/detalle',
            },
            endpoint: 'contabilidad/grupo',
            parametrosHttpConfig: {
              modelo: 'ConGrupo',
              ordenamientos: ['-id'],
            },
            archivos: {
              importar: 'ConGrupo.xlsx',
            },
            ui: {
              verBotonImportar: true,
              verBotonNuevo: true,
              verColumnaEditar: true,
            },
          },
        },
        {
          key: 'ConActivo',
          nombreModelo: 'ACTIVO',
          ajustes: {
            rutas: {
              lista: 'contabilidad/administracion/lista',
              nuevo: 'contabilidad/administracion/nuevo',
              detalle: 'contabilidad/administracion/detalle',
            },
            endpoint: 'contabilidad/grupo',
            parametrosHttpConfig: {
              modelo: 'ConActivo',
              ordenamientos: ['-id'],
            },
            archivos: {
              importar: 'ConActivo.xlsx',
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
          nombreModelo: 'CONTABILIZAR',
          ajustes: {
            rutas: {
              lista: 'contabilidad/utilidad/contabilizar',
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
          nombreModelo: 'BALANCEPRUEBA',
          ajustes: {
            rutas: {
              lista: 'contabilidad/informe/balance_prueba',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'BALANCEPRUEBAPORCONTACTO',
          ajustes: {
            rutas: {
              lista: 'contabilidad/informe/balance_prueba_contacto',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'AUXILIARCUENTA',
          ajustes: {
            rutas: {
              lista: 'contabilidad/informe/auxiliar_cuenta',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'AUXILIARTERCERO',
          ajustes: {
            rutas: {
              lista: 'contabilidad/informe/auxiliar_tercero',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'AUXILIARGENERAL',
          ajustes: {
            rutas: {
              lista: 'contabilidad/informe/auxiliar_general',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'BASE',
          ajustes: {
            rutas: {
              lista: 'contabilidad/informe/base',
              nuevo: '',
            },
          },
        },
        {
          key: null,
          nombreModelo: 'CERTIFICADORETENCION',
          ajustes: {
            rutas: {
              lista: 'contabilidad/informe/certificado_retencion',
              nuevo: '',
            },
          },
        },
      ],
    },
  ],
};
