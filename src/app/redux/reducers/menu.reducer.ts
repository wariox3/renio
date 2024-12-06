import { Identificacion } from './../../interfaces/general/identificacion.';
import { createReducer, on } from '@ngrx/store';
import {
  ActualizarCampoMapeo,
  ActualizarMapeo,
  selecionModuloAction,
} from '../actions/menu.actions';
import { MenuItem } from '@interfaces/menu/menu';
let nombreSeleccion = localStorage.getItem('ruta');

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
              tipo: 'Documento',
              data: {
                documento_clase: 200,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
          ],
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
          children: [
            {
              nombre: 'CUENTASCOBRAR',
              tipo: 'informe',
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
              tipo: 'Documento',
              data: {
                documento_clase: 300,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTACREDITO',
              documentacionId: 1007,
              tipo: 'Documento',
              data: {
                documento_clase: 301,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTADEBITO',
              documentacionId: 1009,
              tipo: 'Documento',
              data: {
                documento_clase: 302,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'DOCUMENTOSOPORTE',
              documentacionId: 1010,
              tipo: 'Documento',
              data: {
                documento_clase: 303,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTAAJUSTE',
              documentacionId: 1011,
              tipo: 'Documento',
              data: {
                documento_clase: 304,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
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
              tipo: 'Administrador',
              data: { modelo: 'GenItem' },
            },
            {
              nombre: 'Contacto',
              tipo: 'Administrador',
              data: {
                modelo: 'GenContacto',
                importarSoloNuevos: 'si',
              },
              archivoImportacionLista: 'GenContacto.xlsx'
            },
            {
              nombre: 'RESOLUCION',
              tipo: 'Administrador',
              data: { modelo: 'GenResolucion', resoluciontipo: 'compra' },
            },
          ],
        },
        {
          nombre: 'utilidad',
          children: [
            {
              nombre: 'DOCUMENTOELECTRONICO',
              tipo: 'utilidad',
              url: 'compra/utilidad/documento_electronico',
            },
            {
              nombre: 'EVENTOSDIAN',
              tipo: 'utilidad',
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
          nombre: '',
          esIndependiente: true,
          children: [
            {
              nombre: 'PERIODO',
              tipo: 'Independiente',
              urlIndependientes: {
                lista: 'contabilidad/periodo',
              },
              consultaHttp: false,
              data: {
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
            },
            {
              nombre: 'MOVIMIENTO',
              tipo: 'Independiente',
              urlIndependientes: {
                lista: 'contabilidad/movimiento',
              },
              consultaHttp: false,
              data: {
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
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
              tipo: 'Documento',
              data: {
                documento_clase: 601,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            // {
            //   nombre: 'MOVIMIENTO',
            //   tipo: 'Documento',
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
              nombre: 'CUENTA',
              tipo: 'Administrador',
              archivoImportacionLista: 'ConCuenta.xlxs',
              data: { modelo: 'ConCuenta' },
            },
            // {
            //   nombre: 'COMPROBANTE',
            //   tipo: 'Administrador',
            //   data: { modelo: 'ConComprobante' },
            // },
            {
              nombre: 'GRUPO',
              tipo: 'Administrador',
              data: { modelo: 'ConGrupo' },
              archivoImportacionLista: 'ConGrupo.xml'
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
              tipo: 'Documento',
              data: {
                documento_clase: 'HumProgramacion',
                ordenamiento: '-fecha_desde',
                modelo: 'HumProgramacionDetalleAdicional',
                visualizarBtnExportarZip: 'si',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: false,
            },
            {
              nombre: 'ADICIONAL',
              tipo: 'Documento',
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
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: false,
            },
            {
              nombre: 'CREDITO',
              tipo: 'Documento',
              data: {
                documento_clase: 'HumCredito',
                ordenamiento: '-id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: false,
            },
            {
              nombre: 'NOVEDAD',
              tipo: 'Documento',
              data: {
                documento_clase: 'HumNovedad',
                ordenamiento: '-id',
                visualizarBtnImportar: 'no'
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
              tipo: 'Documento',
              data: {
                documento_clase: 'HumAporte',
                ordenamiento: '-fecha_desde',
                modelo: 'HumAporte',
                visualizarBtnImportar: 'no'
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
              tipo: 'Documento',
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
              tipo: 'Documento',
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
              tipo: 'Administrador',
              data: {
                modelo: 'GenContacto',
                submodelo: 'GenEmpleado',
                ordenamiento: '-id',
                importarSoloNuevos: 'si',
              },
              archivoImportacionLista: 'GenContacto.xlsx'
            },
            {
              nombre: 'CONTRATO',
              tipo: 'Administrador',
              data: { modelo: 'HumContrato' },
            },
            {
              nombre: 'GRUPO',
              tipo: 'Administrador',
              data: { modelo: 'HumGrupo' },
            },
            {
              nombre: 'CARGO',
              tipo: 'Administrador',
              data: { modelo: 'HumCargo' },
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
            },
            {
              nombre: 'NOMINADETALLE',
              tipo: 'informe',
              url: 'humano/informe/nomina_detalle',
            },
            {
              nombre: 'NOMINAELECTRONICA',
              tipo: 'informe',
              url: 'humano/informe/nomina_electronica',
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
              tipo: 'Documento',
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
              tipo: 'Documento',
              data: {
                documento_clase: 100,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnExportarZip: 'si',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTACREDITO',
              documentacionId: 1015,
              tipo: 'Documento',
              data: {
                documento_clase: 101,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTADEBITO',
              documentacionId: 1016,
              tipo: 'Documento',
              data: {
                documento_clase: 102,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'PAGO',
              documentacionId: 1017,
              tipo: 'Documento',
              data: {
                documento_clase: 200,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'CUENTADECOBRO',
              documentacionId: 1018,
              tipo: 'Documento',
              data: {
                documento_clase: 104,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
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
              tipo: 'Administrador',
              data: {
                modelo: 'GenContacto',
                importarSoloNuevos: 'si',
                dataPersonalizada: JSON.stringify({ cliente: 'si' }),
              },
              archivoImportacionLista: 'GenContacto.xlsx'
            },
            {
              nombre: 'ITEM',
              tipo: 'Administrador',
              data: { modelo: 'GenItem' },
            },
            {
              nombre: 'PRECIO',
              tipo: 'Administrador',
              data: { modelo: 'GenPrecio' },
            },
            {
              nombre: 'ASESOR',
              tipo: 'Administrador',
              data: { modelo: 'GenAsesor' },
            },
            {
              nombre: 'RESOLUCION',
              tipo: 'Administrador',
              data: { modelo: 'GenResolucion', resoluciontipo: 'venta' },
            },
            {
              nombre: 'CuentaBanco',
              tipo: 'Administrador',
              data: { modelo: 'GenCuentaBanco' },
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
              tipo: 'Documento',
              data: {
                documento_clase: 100,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTACREDITO',
              documentacionId: 1015,
              tipo: 'Documento',
              data: {
                documento_clase: 101,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'PAGO',
              documentacionId: 1017,
              tipo: 'Documento',
              data: {
                documento_clase: 200,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
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
              tipo: 'Administrador',
              data: { modelo: 'GenContacto', importarSoloNuevos: 'si' },
              archivoImportacionLista: 'GenContacto.xlsx'
            },
            {
              nombre: 'Item',
              tipo: 'Administrador',
              data: { modelo: 'GenItem' },
            },
            {
              nombre: 'Sede',
              tipo: 'Administrador',
              data: { modelo: 'GenSede' },
            },
            {
              nombre: 'CuentaBanco',
              tipo: 'Administrador',
              data: { modelo: 'GenCuentaBanco' },
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
            },
            {
              nombre: 'CUENTASCOBRAR',
              tipo: 'informe',
              url: 'cartera/informe/cuentas_cobrar',
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
              tipo: 'Documento',
              data: {
                documento_clase: 500,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
              },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'SALIDA',
              tipo: 'Documento',
              data: {
                documento_clase: 501,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
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
              tipo: 'Administrador',
              data: { modelo: 'InvAlmacen' },
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
              tipo: 'Documento',
              data: {
                documento_clase: 400,
                ordenamiento: 'estado_aprobado, -fecha, -numero, -id',
                visualizarBtnImportar: 'no'
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
              nombre: 'CuentaBanco',
              tipo: 'Administrador',
              data: { modelo: 'GenCuentaBanco' },
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
              tipo: 'Independiente',
              urlIndependientes: {
                lista: 'transporte/guia',
              },
              consultaHttp: false,
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
    'COMPRA',
    'VENTA',
    'CONTABILIDAD',
    'CARTERA',
    'HUMANO',
    'INVENTARIO',
    'TESORERIA',
    'TRANSPORTE',
  ],
  dataMapeo: [],
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
  }))
);
