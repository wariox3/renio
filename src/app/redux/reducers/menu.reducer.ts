import { createReducer, on } from '@ngrx/store';
import { selecionModuloAction } from '../actions/menu.actions';

interface informacionItem {
  name: string;
  modelo?: string;
  tipo?: string;
  data?: {
    [key: string]: {};
  };
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
  seleccion: nombreSeleccion == null ? 'GENERAL' : nombreSeleccion,
  informacion: [
    {
      name: 'cartera',
      children: [
        {
          name: 'movimiento',
          icono: 'wysiwyg',
          children: [{ name: 'item' }, { name: 'Brussels sprouts' }],
        },
        {
          name: 'administracion',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'item', url: 'lista', modelo: 'Item' },
            { name: 'contacto', url: 'cartera/administracion/contacto/lista' },
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
          name: 'administracion',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'item', url: 'compra/administracion/item/lista' },
            { name: 'contacto', url: 'compra/administracion/contacto/lista' },
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
          name: 'administracion',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'item', url: 'contabilidad/administracion/item/lista' },
            {
              name: 'contacto',
              url: 'contabilidad/administracion/contacto/lista',
            },
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
          name: 'administracion',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'item', url: 'lista', modelo: 'Item' },
            { name: 'contacto', url: 'humano/administracion/contacto/lista' },
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
          children: [{ name: 'item' }, { name: 'Brussels sprouts' }],
        },
        {
          name: 'administracion',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'item', url: 'venta/administracion/item/lista' },
            { name: 'contacto', url: 'venta/administracion/contacto/lista' },
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
          name: 'administracion',
          icono: 'auto_awesome_mosaic',
          children: [
            { name: 'item', url: 'contabilidad/administracion/item/lista' },
            {
              name: 'contacto',
              url: 'contabilidad/administracion/contacto/lista',
            },
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
          children: [
            {
              name: 'Factura de venta',
              url: 'lista',
              modelo: 'Factura',
              tipo: 'Documento',
              data: { formulario: 'FacturaNuevo' },
            },
          ],
        },
        {
          name: 'administracion',
          icono: 'auto_awesome_mosaic',
          children: [
            {
              name: 'Item',
              url: 'lista',
              modelo: 'Item',
              tipo: 'Administrador',
              data: { formulario: 'ItemNuevo' },
            },
            {
              name: 'Contacto',
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
