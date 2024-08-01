import { createReducer, on } from '@ngrx/store';
import {
  ActualizarCampoMapeo,
  ActualizarMapeo,
  selecionModuloAction,
} from '../actions/menu.actions';

export interface informacionMenuItem {
  nombre: string;
  tipo?: string;
  url?: string;
  visualiazarIconoDeracha?: boolean;
  consultaHttp?: boolean;
  data?: {
    [key: string]: any;
  };
  children?: informacionMenuItem[];
}

export interface Menu {
  seleccion: string;
  informacion: informacionMenuItem[];
  dataMapeo: any[];
  modulos: string[];
}

let nombreSeleccion = localStorage.getItem('ruta');

export const initialState: Menu = {
  seleccion: nombreSeleccion == null ? 'GENERAL' : nombreSeleccion,
  informacion: [
    {
      nombre: 'cartera',
      children: [
        {
          nombre: 'documento',
          children: [
            {
              nombre: 'PAGO',
              tipo: 'Documento',
              data: { documento_clase: 200 },
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
      children: [
        {
          nombre: 'documento',
          children: [
            {
              nombre: 'FACTURACOMPRA',
              tipo: 'Documento',
              data: { documento_clase: 300 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTACREDITO',
              tipo: 'Documento',
              data: { documento_clase: 301 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTADEBITO',
              tipo: 'Documento',
              data: { documento_clase: 302 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'DOCUMENTOSOPORTE',
              tipo: 'Documento',
              data: { documento_clase: 303 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTAAJUSTE',
              tipo: 'Documento',
              data: { documento_clase: 304 },
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
              data: { modelo: 'Item' },
            },
            {
              nombre: 'Contacto',
              tipo: 'Administrador',
              data: { modelo: 'Contacto' },
            },
            {
              nombre: 'RESOLUCION',
              tipo: 'Administrador',
              data: { modelo: 'Resolucion', parametro: 'compra' },
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
          ],
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
      nombre: 'contabilidad',
      children: [
        {
          nombre: 'documento',
          children: [
            {
              nombre: 'ASIENTO',
              tipo: 'Documento',
              data: { documento_clase: 601 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
          ]
          
        },
        {
          nombre: 'administracion',
          children: [
            {
              nombre: 'CUENTA',
              tipo: 'Administrador',
              data: { modelo: 'ConCuenta' },
            },
          ]
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
      nombre: 'humano',
      children: [
        {
          nombre: 'documento',
          children: [
            {
              nombre: 'PROGRAMACION',
              tipo: 'Documento',
              data: { documento_clase: 'HumProgramacion' },
              visualiazarIconoDeracha: true,
              consultaHttp: false,
            },
            {
              nombre: 'ADICIONAL',
              tipo: 'Documento',
              data: { documento_clase: 'HumAdicional' },
              visualiazarIconoDeracha: true,
              consultaHttp: false,
            },
            {
              nombre: 'CREDITO',
              tipo: 'Documento',
              data: { documento_clase: 'HumCredito' },
              visualiazarIconoDeracha: true,
              consultaHttp: false,
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [
            {
              nombre: 'EMPLEADO',
              tipo: 'Administrador',
              data: { modelo: 'Contacto', parametro: 'empleado' },
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
              nombre: 'CONCEPTO',
              tipo: 'Administrador',
              data: { modelo: 'HumConcepto' },
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
      nombre: 'venta',
      children: [
        {
          nombre: 'documento',
          children: [
            {
              nombre: 'FACTURAVENTA',
              tipo: 'Documento',
              data: { documento_clase: 100 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTACREDITO',
              tipo: 'Documento',
              data: { documento_clase: 101 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTADEBITO',
              tipo: 'Documento',
              data: { documento_clase: 102 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'PAGO',
              tipo: 'Documento',
              data: { documento_clase: 200 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [
            {
              nombre: 'CONTACTO',
              tipo: 'Administrador',
              data: { modelo: 'Contacto' },
            },
            {
              nombre: 'ITEM',
              tipo: 'Administrador',
              data: { modelo: 'Item' },
            },
            {
              nombre: 'PRECIO',
              tipo: 'Administrador',
              data: { modelo: 'Precio' },
            },
            {
              nombre: 'ASESOR',
              tipo: 'Administrador',
              data: { modelo: 'Asesor' },
            },
            {
              nombre: 'RESOLUCION',
              tipo: 'Administrador',
              data: { modelo: 'Resolucion', parametro: 'venta' },
            },
            {
              nombre: 'CuentaBanco',
              tipo: 'Administrador',
              data: { modelo: 'CuentaBanco' },
            },
          ],
        },
        {
          nombre: 'utilidad',
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
      nombre: 'contabilidad',
      children: [
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
    {
      nombre: 'general',
      children: [
        {
          nombre: 'documento',
          children: [
            {
              nombre: 'FACTURAVENTA',
              tipo: 'Documento',
              data: { documento_clase: 100 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'NOTACREDITO',
              tipo: 'Documento',
              data: { documento_clase: 101 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'PAGO',
              tipo: 'Documento',
              data: { documento_clase: 200 },
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
              data: { modelo: 'Contacto' },
            },
            {
              nombre: 'Item',
              tipo: 'Administrador',
              data: { modelo: 'Item' },
            },
            {
              nombre: 'Sede',
              tipo: 'Administrador',
              data: { modelo: 'Sede' },
            },
            {
              nombre: 'CuentaBanco',
              tipo: 'Administrador',
              data: { modelo: 'CuentaBanco' },
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
          children: [
            {
              nombre: 'ENTRADA',
              tipo: 'Documento',
              data: { documento_clase: 500 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
            {
              nombre: 'SALIDA',
              tipo: 'Documento',
              data: { documento_clase: 501 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [],
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
          children: [
            {
              nombre: 'EGRESO',
              tipo: 'Documento',
              data: { documento_clase: 400 },
              visualiazarIconoDeracha: true,
              consultaHttp: true,
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [],
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
