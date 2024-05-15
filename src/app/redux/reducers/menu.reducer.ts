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
  data?: {
    [key: string]: any;
  };
  children?: informacionMenuItem[];
}

export interface Menu {
  seleccion: string;
  informacion: informacionMenuItem[];
  dataMapeo: any[];
  modulos: string[]
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
            },
            {
              nombre: 'NOTACREDITO',
              tipo: 'Documento',
              data: { documento_clase: 301 },
            },
            {
              nombre: 'NOTADEBITO',
              tipo: 'Documento',
              data: { documento_clase: 302 },
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
      nombre: 'humano',
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
      nombre: 'venta',
      children: [
        {
          nombre: 'documento',
          children: [
            {
              nombre: 'FACTURAVENTA',
              tipo: 'Documento',
              data: { documento_clase: 100 },
            },
            {
              nombre: 'NOTACREDITO',
              tipo: 'Documento',
              data: { documento_clase: 101 },
            },
            {
              nombre: 'NOTADEBITO',
              tipo: 'Documento',
              data: { documento_clase: 102 },
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
              data: { modelo: 'Resolucion' },
            },
          ],
        },
        {
          nombre: 'utilidad',
          children: [
            {
              nombre: 'FACTURAELECTRONICA',
              tipo: 'utilidad',
              url: 'venta/utilidad/factura_electronica'
            },
          ]
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
              url: 'venta/informe/ventas_items'
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
          ]
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
            },
            {
              nombre: 'NOTACREDITO',
              tipo: 'Documento',
              data: { documento_clase: 101 },
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
              nombre: 'ENTREDA',
              tipo: 'Documento',
              data: { documento_clase: 500 },
            },
            {
              nombre: 'SALIDA',
              tipo: 'Documento',
              data: { documento_clase: 501 },
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [
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
          children: [
            {
              nombre: 'EGRESO',
              tipo: 'Documento',
              data: { documento_clase: 400 },
            }
          ],
        },
        {
          nombre: 'administracion',
          children: [
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
  ],
  modulos: ['COMPRA', 'VENTA', 'CONTABILIDAD', 'CARTERA', 'HUMANO', 'INVENTARIO', 'TESORERIA'],
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
    dataMapeo
  }))
);
