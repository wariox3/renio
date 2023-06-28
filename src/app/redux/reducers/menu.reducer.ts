import { createReducer, on } from '@ngrx/store';
import { selecionModuloAction } from '../actions/menu.actions';

interface informacionItem {
  name: string;
  url?: string;
  icono?: string;
  children?: informacionItem[];
}

export interface Menu {
  seleccion: string;
  informacion: informacionItem[];
}

let nombreSeleccion = localStorage.getItem('ruta');

export const initialState: Menu = {
  seleccion: nombreSeleccion == null ? 'general' : nombreSeleccion,
  informacion: [
    {
      name: 'cartera',
      children: [
        {
          name: 'movimiento',
          icono: 'wysiwyg',
          children: [{ name: 'Item' }, { name: 'Brussels sprouts' }],
        },
        {
          name: 'administración',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'Item', url: 'cartera/administracion/item/lista' },
            { name: 'Contacto', url: 'cartera/administracion/contacto/lista' }
          ],
        },
        {
          name: 'utilidad',
          icono: 'storage',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'proceso',
          icono: 'webhook',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'informe',
          icono: 'table_rows',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
      ],
    },
    {
      name: 'compra',
      children: [
        {
          name: 'movimiento',
          icono: 'wysiwyg',
          children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
        },
        {
          name: 'administración',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'Item', url: 'compra/administracion/item/lista' },
            { name: 'Contacto', url: 'compra/administracion/contacto/lista' }
          ],
        },
        {
          name: 'utilidad',
          icono: 'storage',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'proceso',
          icono: 'webhook',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'informe',
          icono: 'table_rows',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
      ],
    },
    {
      name: 'contabilidad',
      children: [
        {
          name: 'movimiento',
          icono: 'wysiwyg',
          children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
        },
        {
          name: 'administración',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'Item', url: 'contabilidad/administracion/item/lista' },
            { name: 'Contacto', url: 'contabilidad/administracion/contacto/lista' }
          ],
        },
        {
          name: 'utilidad',
          icono: 'storage',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'proceso',
          icono: 'webhook',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'informe',
          icono: 'table_rows',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
      ],
    },
    {
      name: 'humano',
      children: [
        {
          name: 'movimiento',
          icono: 'wysiwyg',
          children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
        },
        {
          name: 'administración',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'Item', url: 'humano/administracion/item/lista' },
            { name: 'Contacto', url: 'humano/administracion/contacto/lista' }
          ],
        },
        {
          name: 'utilidad',
          icono: 'storage',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'proceso',
          icono: 'webhook',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'informe',
          icono: 'table_rows',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
      ],
    },
    {
      name: 'venta',
      children: [
        {
          name: 'movimiento',
          icono: 'wysiwyg',
          children: [
            { name: 'Item', },
            { name: 'Brussels sprouts' },
          ],
        },
        {
          name: 'administración',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'Item', url: 'venta/administracion/item/lista' },
            { name: 'Contacto', url: 'venta/administracion/contacto/lista' }
          ],
        },
        {
          name: 'utilidad',
          icono: 'storage',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'proceso',
          icono: 'webhook',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'informe',
          icono: 'table_rows',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
      ],
    },
    {
      name: 'contabilidad',
      children: [
        {
          name: 'movimiento',
          icono: 'wysiwyg',
          children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
        },
        {
          name: 'administración',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'Item', url: 'contabilidad/administracion/item/lista' },
            { name: 'Contacto', url: 'contabilidad/administracion/contacto/lista' }
          ],
        },
        {
          name: 'utilidad',
          icono: 'storage',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'proceso',
          icono: 'webhook',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
        {
          name: 'informe',
          icono: 'table_rows',
          children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
        },
      ],
    },
    {
      name: 'general',
      children: [
        {
          name: 'movimiento',
          icono: 'wysiwyg',
          children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
        },
        {
          name: 'administración',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'Item', url: 'general/administracion/item/lista' },
            { name: 'Contacto', url: 'general/administracion/contacto/lista' }
          ],
        }
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
