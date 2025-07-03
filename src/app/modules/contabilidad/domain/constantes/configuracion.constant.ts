import { ModuloConfig } from '@interfaces/menu/configuracion.interface';
import { CONTACTO_FILTERS } from '@modulos/general/domain/mapeos/contacto.mapeo';
import { DOCUMENTO_FILTERS } from 'src/app/core/constants/mapeo/documento.mapeo';
import { CUENTA_FILTERS } from '../mapeos/cuenta.mapeo';
import { GRUPO_FILTERS } from '@modulos/humano/domain/mapeo/grupo.mapeo';
import { ACTIVO_FILTERS } from '../mapeos/activo.mapeo';

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
          documentacion: {
            id: 1021,
          },
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
          documentacion: {
            id: 1022,
          },
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
            queryParams:{
              serializador: 'lista',
              documento_tipo_id: 13,
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
          key: 602,
          nombreModelo: 'DEPRECIACION',
          documentacion: {
            id: 1023,
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
              serializador: 'lista',
              documento_tipo_id: 23,
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
          key: 603,
          nombreModelo: 'CIERRE',
          documentacion: {
            id: 1024,
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
              serializador: 'lista',
              documento_tipo_id: 25,
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
      ],
    },
    {
      nombreFuncionalidad: 'administracion',
      modelos: [
        {
          key: 'GenContacto',
          nombreModelo: 'Contacto',
          documentacion: {
            id: 1036
          },
          ajustes: {
            rutas: {
              lista: 'contabilidad/administracion/lista',
              nuevo: 'contabilidad/administracion/nuevo',
              detalle: 'contabilidad/administracion/detalle',
            },
            endpoint: 'general/contacto',
            queryParams: {
              serializador: 'lista'
            },
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
        {
          key: 'ConCuenta',
          nombreModelo: 'CUENTA',
          documentacion: {
            id: 1025
          },
          ajustes: {
            rutas: {
              lista: 'contabilidad/administracion/lista',
              nuevo: 'contabilidad/administracion/nuevo',
              detalle: 'contabilidad/administracion/detalle',
            },
            endpoint: 'contabilidad/cuenta',
            queryParams: {
              ordering: 'codigo',
            },
            parametrosHttpConfig: {
              modelo: 'ConCuenta',
              filtros: {
                ui: CUENTA_FILTERS
              }
            },
            archivos: {
              importar: {
                nombre: 'ConCuenta',
                rutaEjemplo: 'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/ConCuenta.xlsx',
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
          key: 'ConGrupo',
          nombreModelo: 'GRUPO',
          documentacion: {
            id: 1026
          },
          ajustes: {
            rutas: {
              lista: 'contabilidad/administracion/lista',
              nuevo: 'contabilidad/administracion/nuevo',
              detalle: 'contabilidad/administracion/detalle',
            },
            endpoint: 'contabilidad/grupo',
            queryParams: {
              ordering: '-id',
            },
            parametrosHttpConfig: {
              modelo: 'ConGrupo',
              filtros: {
                ui: GRUPO_FILTERS
              }
            },
            archivos: {
              importar: {
                nombre: 'ConGrupo',
                rutaEjemplo: 'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/ConGrupo.xlsx',
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
          key: 'ConActivo',
          nombreModelo: 'ACTIVO',
          documentacion: {
            id: 1027
          },
          ajustes: {
            rutas: {
              lista: 'contabilidad/administracion/lista',
              nuevo: 'contabilidad/administracion/nuevo',
              detalle: 'contabilidad/administracion/detalle',
            },
            endpoint: 'contabilidad/activo',
            queryParams: {
              ordering: '-id',
            },
            parametrosHttpConfig: {
              modelo: 'ConActivo',
              filtros: {
                ui: ACTIVO_FILTERS
              }
            },
            archivos: {
              importar: {
                nombre: 'ConActivo',
                rutaEjemplo: 'https://semantica.sfo3.digitaloceanspaces.com/renio/ejemplos/ConActivo.xlsx',
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
      nombreFuncionalidad: 'utilidad',
      modelos: [
        {
          key: null,
          nombreModelo: 'CONTABILIZAR',
          documentacion: {
            id: 1028
          },
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
          documentacion: {
            id: 1029
          },
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
          documentacion: {
            id: 1030
          },
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
          documentacion: {
            id: 1031
          },
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
          documentacion: {
            id: 1032
          },
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
          documentacion: {
            id: 1033
          },
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
          documentacion: {
            id: 1034
          },
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
          documentacion: {
            id: 1035
          },
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
