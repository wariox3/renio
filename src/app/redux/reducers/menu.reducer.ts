import { MenuItem } from '@interfaces/menu/menu';
import { createReducer, on } from '@ngrx/store';
import {
  ActualizarCampoMapeo,
  ActualizarDataItem,
  ActualizarMapeo,
  selecionModuloAction,
} from '../actions/menu.actions';
import { AplicacionModulo } from '@comun/type/aplicacion-modulo.type';
let nombreSeleccion: AplicacionModulo = localStorage.getItem(
  'ruta'
) as AplicacionModulo;

export const initialState: MenuItem = {
  seleccion: nombreSeleccion == null ? 'GENERAL' : nombreSeleccion,
  informacion: [
    {
      nombre: 'cartera',
      children: [
        {
          nombre: 'documento',
          menuOpen: true,
          children: [
            {
              nombre: 'PAGO',
              documentacionId: 1019,
              tipo: 'documento',
              modulo: 'cartera',
              data: {
                documento_clase: 200,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'SALDOINICIAL',
              tipo: 'documento',
              modulo: 'cartera',
              data: {
                documento_clase: 201,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'si',
              },
              archivoImportacionLista: 'SaldoInicial.xlsx',
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [
            {
              nombre: 'Contacto',
              tipo: 'administrador',
              modulo: 'cartera',
              data: {
                modelo: 'GenContacto',
              },
              maestros: [
                {
                  endpoint:
                    'https://semantica.sfo3.digitaloceanspaces.com/renio/maestros/ciudades.xlsx',
                  name: 'Ciudades',
                },
              ],
              archivoImportacionLista: 'GenContacto.xlsx',
            },
          ],
        },
        {
          nombre: 'utilidad',
        },
        {
          nombre: 'proceso',
        },
        {
          nombre: 'informe',
          children: [
            {
              nombre: 'CUENTASCOBRAR',
              tipo: 'informe',
              modulo: 'cartera',
              url: 'cartera/informe/cuentas_cobrar',
            },
          ],
        },
      ],
    },
    {
      nombre: 'compra',
      menuOpen: true,
      children: [
        {
          nombre: 'documento',
          children: [
            {
              nombre: 'FACTURACOMPRA',
              documentacionId: 1007,
              tipo: 'documento',
              modulo: 'compra',
              data: {
                documento_clase: 300,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTACREDITO',
              documentacionId: 1007,
              tipo: 'documento',
              modulo: 'compra',
              data: {
                documento_clase: 301,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTADEBITO',
              documentacionId: 1009,
              tipo: 'documento',
              modulo: 'compra',
              data: {
                documento_clase: 302,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'documentoSOPORTE',
              documentacionId: 1010,
              tipo: 'documento',
              modulo: 'compra',
              data: {
                documento_clase: 303,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTAAJUSTE',
              documentacionId: 1011,
              tipo: 'documento',
              modulo: 'compra',
              data: {
                documento_clase: 304,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [
            {
              nombre: 'Item',
              tipo: 'administrador',
              data: { modelo: 'GenItem' },
              modulo: 'compra',
            },
            {
              nombre: 'Contacto',
              tipo: 'administrador',
              maestros: [
                {
                  endpoint:
                    'https://semantica.sfo3.digitaloceanspaces.com/renio/maestros/ciudades.xlsx',
                  name: 'Ciudades',
                },
              ],
              data: {
                modelo: 'GenContacto',
                importarSoloNuevos: 'si',
              },
              modulo: 'compra',
              archivoImportacionLista: 'GenContacto.xlsx',
            },
            {
              nombre: 'RESOLUCION',
              tipo: 'administrador',
              modulo: 'compra',
              data: { modelo: 'GenResolucion', resoluciontipo: 'compra' },
            },
          ],
        },
        {
          nombre: 'utilidad',
          children: [
            {
              nombre: 'documentoELECTRONICO',
              tipo: 'utilidad',
              modulo: 'compra',
              url: 'compra/utilidad/documento_electronico',
            },
            {
              nombre: 'EVENTOSDIAN',
              tipo: 'utilidad',
              modulo: 'compra',
              url: 'compra/utilidad/eventos_dian',
            },
          ],
        },
        {
          nombre: 'proceso',
        },
        {
          nombre: 'informe',
          children: [
            {
              nombre: 'CUENTASPAGAR',
              tipo: 'informe',
              modulo: 'compra',
              url: 'compra/informe/cuentas_pagar',
            },
          ],
        },
      ],
    },
    {
      nombre: 'contabilidad',
      menuOpen: true,
      children: [
        {
          nombre: 'independientes',
          esIndependiente: true,
          children: [
            {
              nombre: 'PERIODO',
              tipo: 'independiente',
              modulo: 'contabilidad',
              urlIndependientes: {
                lista: 'contabilidad/periodo',
              },
              consultaHttp: false,
              data: {
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
            },
            {
              nombre: 'MOVIMIENTO',
              tipo: 'independiente',
              modulo: 'contabilidad',
              archivoImportacionLista: 'ConMovimiento.xlsx',
              urlIndependientes: {
                lista: 'contabilidad/movimiento',
              },
              consultaHttp: false,
              data: {
                modelo: 'ConMovimiento',
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
            },
          ],
        },
        {
          nombre: 'documento',
          children: [
            {
              nombre: 'ASIENTO',
              documentacionId: 1020,
              tipo: 'documento',
              modulo: 'contabilidad',
              data: {
                documento_clase: 601,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            // {
            //   nombre: 'MOVIMIENTO',
            //   tipo: 'documento',
            //   data: { documento_clase: 'ConMovimiento' },
            //   visualiazarIconoDeracha: true,
            //   consultaHttp: false,
            // },
          ],
        },
        {
          nombre: 'administracion',
          children: [
            {
              nombre: 'CONTACTO',
              tipo: 'administrador',
              modulo: 'contabilidad',
              data: {
                modelo: 'GenContacto',
                importarSoloNuevos: 'si',
              },
              maestros: [
                {
                  endpoint:
                    'https://semantica.sfo3.digitaloceanspaces.com/renio/maestros/ciudades.xlsx',
                  name: 'Ciudades',
                },
              ],
              archivoImportacionLista: 'GenContacto.xlsx',
            },
            {
              nombre: 'CUENTA',
              tipo: 'administrador',
              modulo: 'contabilidad',
              archivoImportacionLista: 'ConCuenta.xlxs',
              data: { modelo: 'ConCuenta', ordenamiento: 'codigo' },
            },
            // {
            //   nombre: 'COMPROBANTE',
            //   tipo: 'administrador',
            //   data: { modelo: 'ConComprobante' },
            // },
            {
              nombre: 'GRUPO',
              tipo: 'administrador',
              modulo: 'contabilidad',
              data: { modelo: 'ConGrupo' },
              archivoImportacionLista: 'ConGrupo.xml',
            },
          ],
        },
        {
          nombre: 'utilidad',
        },
        {
          nombre: 'proceso',
        },
        {
          nombre: 'informe',
          children: [
            {
              nombre: 'BALANCEPRUEBA',
              tipo: 'informe',
              modulo: 'contabilidad',
              url: 'contabilidad/informe/balance_prueba',
            },
          ],
        },
      ],
    },
    {
      nombre: 'humano',
      children: [
        {
          nombre: 'nomina',
          menuOpen: true,
          children: [
            {
              nombre: 'PROGRAMACION',
              tipo: 'documento',
              modulo: 'humano',
              data: {
                documento_clase: 'HumProgramacion',
                ordenamiento: '-fecha_desde',
                modelo: 'HumProgramacionDetalleAdicional',
                visualizarBtnExportarZip: 'si',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: false,
            },
            {
              nombre: 'ADICIONAL',
              tipo: 'documento',
              modulo: 'humano',
              data: {
                documento_clase: 'HumAdicional',
                ordenamiento: '-id',
                filtrosLista: [
                  {
                    propiedad: 'permanente',
                    valor1: true,
                  },
                ],
                filtrosImportar: [
                  {
                    propiedad: 'permanente',
                    valor1: true,
                  },
                ],
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: false,
            },
            {
              nombre: 'CREDITO',
              tipo: 'documento',
              modulo: 'humano',
              data: {
                documento_clase: 'HumCredito',
                ordenamiento: '-id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: false,
            },
            {
              nombre: 'NOVEDAD',
              tipo: 'documento',
              modulo: 'humano',
              data: {
                documento_clase: 'HumNovedad',
                ordenamiento: '-id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: false,
            },
          ],
        },
        {
          nombre: 'seguridadSocial',
          menuOpen: true,
          children: [
            {
              nombre: 'APORTE',
              tipo: 'documento',
              modulo: 'humano',
              data: {
                documento_clase: 'HumAporte',
                ordenamiento: '-fecha_desde',
                modelo: 'HumAporte',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: false,
            },
          ],
        },
        {
          nombre: 'documento',
          menuOpen: false,
          children: [
            {
              nombre: 'NOMINA',
              tipo: 'documento',
              modulo: 'humano',
              data: {
                documento_clase: 701,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarColumnaEditar: 'no',
                visualizarBtnNuevo: 'no',
                visualizarBtnEliminar: 'no',
                visualizarColumnaSeleccionar: 'no',
                visualizarBtnImportar: 'no',
                visualizarBtnExportarZip: 'si',
              },
              visualiazarIconoDeracha: false,
              consultaHttp: true,
            },
            {
              nombre: 'NOMINAELECTRONICA',
              tipo: 'documento',
              modulo: 'humano',
              data: {
                documento_clase: 702,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                serializador: 'Nomina',
                visualizarColumnaEditar: 'no',
                visualizarBtnNuevo: 'no',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: false,
              consultaHttp: true,
              configuracionExtra: true,
            },
          ],
        },
        {
          nombre: 'administracion',
          menuOpen: false,
          children: [
            {
              nombre: 'EMPLEADO',
              tipo: 'administrador',
              modulo: 'humano',
              data: {
                modelo: 'GenContacto',
                submodelo: 'GenEmpleado',
                ordenamiento: '-id',
                importarSoloNuevos: 'si',
              },
              archivoImportacionLista: 'GenContacto.xlsx',
            },
            {
              nombre: 'CONTRATO',
              tipo: 'administrador',
              data: { modelo: 'HumContrato' },
              modulo: 'humano',
            },
            {
              nombre: 'GRUPO',
              tipo: 'administrador',
              data: { modelo: 'HumGrupo' },
              modulo: 'humano',
            },
            {
              nombre: 'CARGO',
              tipo: 'administrador',
              data: { modelo: 'HumCargo' },
              modulo: 'humano',
            },
          ],
        },
        {
          nombre: 'utilidad',
        },
        {
          nombre: 'proceso',
        },
        {
          nombre: 'informe',
          children: [
            {
              nombre: 'NOMINA',
              tipo: 'informe',
              url: 'humano/informe/nomina',
              modulo: 'humano',
            },
            {
              nombre: 'NOMINADETALLE',
              tipo: 'informe',
              url: 'humano/informe/nomina_detalle',
              modulo: 'humano',
            },
            {
              nombre: 'NOMINAELECTRONICA',
              tipo: 'informe',
              url: 'humano/informe/nomina_electronica',
              modulo: 'humano',
            },
          ],
        },
      ],
    },
    {
      nombre: 'venta',
      children: [
        {
          nombre: 'documento',
          menuOpen: true,
          children: [
            {
              nombre: 'FACTURARECURRENTE',
              documentacionId: 1013,
              tipo: 'documento',
              modulo: 'venta',
              data: {
                documento_clase: 103,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
              configuracionExtra: true,
            },
            {
              nombre: 'FACTURAVENTA',
              documentacionId: 1014,
              tipo: 'documento',
              modulo: 'venta',
              data: {
                documento_clase: 100,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnExportarZip: 'si',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTACREDITO',
              documentacionId: 1015,
              tipo: 'documento',
              modulo: 'venta',
              data: {
                documento_clase: 101,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTADEBITO',
              documentacionId: 1016,
              tipo: 'documento',
              modulo: 'venta',
              data: {
                documento_clase: 102,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'PAGO',
              documentacionId: 1017,
              tipo: 'documento',
              modulo: 'venta',
              data: {
                documento_clase: 200,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'CUENTADECOBRO',
              documentacionId: 1018,
              tipo: 'documento',
              modulo: 'venta',
              data: {
                documento_clase: 104,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
          ],
        },
        {
          nombre: 'administracion',
          menuOpen: false,
          children: [
            {
              nombre: 'CONTACTO',
              tipo: 'administrador',
              modulo: 'venta',
              data: {
                modelo: 'GenContacto',
                importarSoloNuevos: 'si',
              },
              maestros: [
                {
                  endpoint:
                    'https://semantica.sfo3.digitaloceanspaces.com/renio/maestros/ciudades.xlsx',
                  name: 'Ciudades',
                },
              ],
              archivoImportacionLista: 'GenContacto.xlsx',
            },
            {
              nombre: 'ITEM',
              tipo: 'administrador',
              data: { modelo: 'GenItem' },
              modulo: 'venta',
            },
            {
              nombre: 'PRECIO',
              tipo: 'administrador',
              data: { modelo: 'GenPrecio' },
              modulo: 'venta',
            },
            {
              nombre: 'ASESOR',
              tipo: 'administrador',
              data: { modelo: 'GenAsesor' },
              modulo: 'venta',
            },
            {
              nombre: 'RESOLUCION',
              tipo: 'administrador',
              data: { modelo: 'GenResolucion', resoluciontipo: 'venta' },
              modulo: 'venta',
            },
            {
              nombre: 'CuentaBanco',
              tipo: 'administrador',
              data: { modelo: 'GenCuentaBanco' },
              modulo: 'venta',
            },
          ],
        },
        {
          nombre: 'utilidad',
          menuOpen: false,
          children: [
            {
              nombre: 'FACTURAELECTRONICA',
              tipo: 'utilidad',
              url: 'venta/utilidad/factura_electronica',
              modulo: 'venta',
            },
          ],
        },
        {
          nombre: 'proceso',
        },
        {
          nombre: 'informe',
          children: [
            // {
            //   nombre: 'VENTASGENERAL',
            //   tipo: 'informe',
            //   url: 'venta/informe/ventas_general'
            // },
            {
              nombre: 'VENTASITEM',
              tipo: 'informe',
              url: 'venta/informe/ventas_items',
              modulo: 'venta',
            },
            // {
            //   nombre: 'VENTASCLIENTE',
            //   tipo: 'informe',
            //   url: 'venta/informe/ventas_cliente'
            // },
            // {
            //   nombre: 'VENTASVENDEDOR',
            //   tipo: 'informe',
            //   url: 'venta/informe/ventas_vendedores'
            // },
          ],
        },
      ],
    },
    {
      nombre: 'general',
      children: [
        {
          nombre: 'documento',
          menuOpen: true,
          children: [
            {
              nombre: 'FACTURAVENTA',
              documentacionId: 1014,
              tipo: 'documento',
              modulo: 'general',
              data: {
                documento_clase: 100,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTACREDITO',
              documentacionId: 1015,
              tipo: 'documento',
              modulo: 'general',
              data: {
                documento_clase: 101,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'PAGO',
              documentacionId: 1017,
              tipo: 'documento',
              modulo: 'general',
              data: {
                documento_clase: 200,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [
            {
              nombre: 'Contacto',
              tipo: 'administrador',
              data: { modelo: 'GenContacto', importarSoloNuevos: 'si' },
              maestros: [
                {
                  endpoint:
                    'https://semantica.sfo3.digitaloceanspaces.com/renio/maestros/ciudades.xlsx',
                  name: 'Ciudades',
                },
              ],
              archivoImportacionLista: 'GenContacto.xlsx',
              modulo: 'general',
            },
            {
              nombre: 'Item',
              tipo: 'administrador',
              data: { modelo: 'GenItem' },
              modulo: 'general',
            },
            {
              nombre: 'Sede',
              tipo: 'administrador',
              data: { modelo: 'GenSede' },
              modulo: 'general',
            },
            {
              nombre: 'CuentaBanco',
              tipo: 'administrador',
              data: { modelo: 'GenCuentaBanco' },
              modulo: 'general',
            },
          ],
        },
        {
          nombre: 'informe',
          children: [
            {
              nombre: 'VENTASITEM',
              tipo: 'informe',
              url: 'venta/informe/ventas_items',
              modulo: 'general',
            },
            {
              nombre: 'CUENTASCOBRAR',
              tipo: 'informe',
              url: 'cartera/informe/cuentas_cobrar',
              modulo: 'general',
            },
          ],
        },
      ],
    },
    {
      nombre: 'inventario',
      children: [
        {
          nombre: 'documento',
          menuOpen: true,
          children: [
            {
              nombre: 'ENTRADA',
              tipo: 'documento',
              modulo: 'inventario',

              data: {
                documento_clase: 500,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'SALIDA',
              tipo: 'documento',
              modulo: 'inventario',

              data: {
                documento_clase: 501,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [
            {
              nombre: 'Almacen',
              tipo: 'administrador',
              data: { modelo: 'InvAlmacen' },
              modulo: 'inventario',
            },
          ],
        },
        {
          nombre: 'utilidad',
        },
        {
          nombre: 'proceso',
        },
        {
          nombre: 'informe',
        },
      ],
    },
    {
      nombre: 'tesoreria',
      children: [
        {
          nombre: 'documento',
          documentacionId: 1012,
          menuOpen: true,
          children: [
            {
              nombre: 'EGRESO',
              tipo: 'documento',
              modulo: 'tesoreria',
              data: {
                documento_clase: 400,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no',
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'SALDOINICIAL',
              tipo: 'documento',
              modulo: 'tesoreria',
              data: {
                documento_clase: 401,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'si',
              },
              archivoImportacionLista: 'SaldoInicial.xlsx',
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [
            {
              nombre: 'CuentaBanco',
              tipo: 'administrador',
              data: { modelo: 'GenCuentaBanco' },
              modulo: 'tesoreria',
            },
            {
              nombre: 'Contacto',
              tipo: 'administrador',
              modulo: 'tesoreria',
              data: {
                modelo: 'GenContacto',
              },
              maestros: [
                {
                  endpoint:
                    'https://semantica.sfo3.digitaloceanspaces.com/renio/maestros/ciudades.xlsx',
                  name: 'Ciudades',
                },
              ],
              archivoImportacionLista: 'GenContacto.xlsx',
            },
          ],
        },
        {
          nombre: 'utilidad',
        },
        {
          nombre: 'proceso',
        },
        {
          nombre: 'informe',
          children: [
            {
              nombre: 'CUENTASPAGAR',
              tipo: 'informe',
              url: 'tesoreria/informe/cuentas_pagar',
              modulo: 'tesoreria',
            },
          ],
        },
      ],
    },
    {
      nombre: 'transporte',
      menuOpen: true,
      children: [
        {
          nombre: '',
          esIndependiente: true,
          children: [
            {
              nombre: 'GUIA',
              tipo: 'independiente',
              urlIndependientes: {
                lista: 'transporte/guia',
              },
              consultaHttp: false,
              modulo: 'transporte',
            },
          ],
        },
        {
          nombre: 'documento',
        },
        {
          nombre: 'administracion',
        },
        {
          nombre: 'utilidad',
        },
        {
          nombre: 'proceso',
        },
        {
          nombre: 'informe',
        },
      ],
    },
  ],
  modulos: [
    'compra',
    'venta',
    'contabilidad',
    'cartera',
    'humano',
    'inventario',
    'tesoreria',
    'transporte',
  ],
  dataMapeo: [],
  dataItem: {
    nombre: '',
  },
};

export const menuReducer = createReducer(
  initialState,
  on(selecionModuloAction, (state, { seleccion }) => ({
    ...state,
    seleccion,
  })),
  on(ActualizarMapeo, (state, { dataMapeo }) => ({
    ...state,
    dataMapeo,
  })),
  on(ActualizarCampoMapeo, (state, { dataMapeo }) => ({
    ...state,
    dataMapeo,
  })),
  on(ActualizarDataItem, (state, { dataItem }) => ({
    ...state,
    dataItem,
  }))
);
