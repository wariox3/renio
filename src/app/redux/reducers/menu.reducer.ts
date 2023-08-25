import { createReducer, on } from '@ngrx/store';
import { selecionModuloAction } from '../actions/menu.actions';

interface informacionItem {
  nombre: string;
  modelo?: string;
  tipo?: string;
  data?: {
    [key: string]: {};
  };
  url?: string;
  children?: informacionItem[];
}

export interface Menu {
  seleccion: string;
  informacion: informacionItem[];
}

let nombreSeleccion = localStorage.getItem('ruta');

export const initialState: Menu = {
  seleccion: nombreSeleccion == null ? 'GENERAL' : nombreSeleccion,
  informacion: [
    {
      nombre: 'cartera',
      children: [
        {
          nombre: 'movimiento',
          children: [{ nombre: 'item' }, { nombre: 'Brussels sprouts' }],
        },
        {
          nombre: 'administracion',
          children: [
            { nombre: 'item', url: 'lista', modelo: 'Item' },
            { nombre: 'contacto', url: 'cartera/administracion/contacto/lista' },
          ],
        },
        {
          nombre: 'utilidad',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'proceso',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'informe',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
      ],
    },
    {
      nombre: 'compra',
      children: [
        {
          nombre: 'movimiento',
          children: [{ nombre: 'Broccoli' }, { nombre: 'Brussels sprouts' }],
        },
        {
          nombre: 'administracion',
          children: [
            { nombre: 'item', url: 'compra/administracion/item/lista' },
            { nombre: 'contacto', url: 'compra/administracion/contacto/lista' },
          ],
        },
        {
          nombre: 'utilidad',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'proceso',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'informe',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
      ],
    },
    {
      nombre: 'contabilidad',
      children: [
        {
          nombre: 'movimiento',
          children: [{ nombre: 'Broccoli' }, { nombre: 'Brussels sprouts' }],
        },
        {
          nombre: 'administracion',
          children: [
            { nombre: 'item', url: 'contabilidad/administracion/item/lista' },
            {
              nombre: 'contacto',
              url: 'contabilidad/administracion/contacto/lista',
            },
          ],
        },
        {
          nombre: 'utilidad',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'proceso',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'informe',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
      ],
    },
    {
      nombre: 'humano',
      children: [
        {
          nombre: 'movimiento',

          children: [{ nombre: 'Broccoli' }, { nombre: 'Brussels sprouts' }],
        },
        {
          nombre: 'administracion',

          children: [
            { nombre: 'item', url: 'lista', modelo: 'Item' },
            { nombre: 'contacto', url: 'humano/administracion/contacto/lista' },
          ],
        },
        {
          nombre: 'utilidad',

          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'proceso',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'informe',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
      ],
    },
    {
      nombre: 'venta',
      children: [
        {
          nombre: 'movimiento',

          children: [{ nombre: 'item' }, { nombre: 'Brussels sprouts' }],
        },
        {
          nombre: 'administracion',

          children: [
            { nombre: 'item', url: 'venta/administracion/item/lista' },
            { nombre: 'contacto', url: 'venta/administracion/contacto/lista' },
          ],
        },
        {
          nombre: 'utilidad',

          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'proceso',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'informe',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
      ],
    },
    {
      nombre: 'contabilidad',
      children: [
        {
          nombre: 'movimiento',

          children: [{ nombre: 'Broccoli' }, { nombre: 'Brussels sprouts' }],
        },
        {
          nombre: 'administracion',

          children: [
            { nombre: 'item', url: 'contabilidad/administracion/item/lista' },
            {
              nombre: 'contacto',
              url: 'contabilidad/administracion/contacto/lista',
            },
          ],
        },
        {
          nombre: 'utilidad',

          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'proceso',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
        {
          nombre: 'informe',
          children: [{ nombre: 'Pumpkins' }, { nombre: 'Carrots' }],
        },
      ],
    },
    {
      nombre: 'general',
      children: [
        {
          nombre: 'movimiento',

          children: [
            {
              nombre: 'FACTURAVENTA',
              url: 'lista',
              modelo: 'Factura',
              tipo: 'Documento',
              data: { formulario: 'FacturaNuevo' },
            },
          ],
        },
        {
          nombre: 'administracion',

          children: [
            {
              nombre: 'Item',
              url: 'lista',
              modelo: 'Item',
              tipo: 'Administrador',
              data: { formulario: 'ItemNuevo' },
            },
            {
              nombre: 'Contacto',
              url: 'lista',
              modelo: 'Contacto',
              tipo: 'Administrador',
              data: { formulario: 'ContactoNuevo' },
            },
          ],
        },
      ],
    },
  ],
};

export const menuReducer = createReducer(
  initialState,
  on(selecionModuloAction, (state, { seleccion }) => ({
    ...state,
    seleccion,
  }))
);
