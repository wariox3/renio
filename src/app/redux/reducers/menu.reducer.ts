import { createReducer, on } from '@ngrx/store';
import { selecionModuloAction } from '../actions/menu.actions';

export interface informacionMenuItem {
  nombre: string;
  modelo?: string;
  tipo?: string;
  data?: {
    [key: string]: {};
  };
  children?: informacionMenuItem[];
}

export interface Menu {
  seleccion: string;
  informacion: informacionMenuItem[];
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
              modelo: 'Item',
              tipo: 'Administrador',
              data: { formulario: 'ItemNuevo' },
            },
            {
              nombre: 'Contacto',
              modelo: 'Contacto',
              tipo: 'Administrador',
              data: { formulario: 'ContactoNuevo' },
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
              modelo: 'Factura',
              tipo: 'Documento',
              data: { documento_clase: 1, documento_tipo: 1 },
            },
            {
              nombre: 'NOTACREDITO',
              modelo: 'Factura',
              tipo: 'Documento',
              data: { documento_clase: 2, documento_tipo: 2 },
            },
            {
              nombre: 'NOTADEBITO',
              modelo: 'Factura',
              tipo: 'Documento',
              data: { documento_clase: 3, documento_tipo: 3 },
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [
            {
              nombre: 'Contacto',
              modelo: 'Contacto',
              tipo: 'Administrador',
            },
            {
              nombre: 'Item',
              modelo: 'Item',
              tipo: 'Administrador',
            },
            {
              nombre: 'Precio',
              modelo: 'Precio',
              tipo: 'Administrador',
            },
            {
              nombre: 'Asesor',
              modelo: 'Asesor',
              tipo: 'Administrador',
            },
            {
              nombre: 'Resolucion',
              modelo: 'Resolucion',
              tipo: 'Administrador',
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
      nombre: 'general',
      children: [
        {
          nombre: 'documento',

          children: [
            {
              nombre: 'FACTURAVENTA',
              modelo: 'Factura',
              tipo: 'Documento',
              data: { documento_clase: 1, documento_tipo: 1 },
            },
          ],
        },
        {
          nombre: 'administracion',
          children: [
            {
              nombre: 'Contacto',
              modelo: 'Contacto',
              tipo: 'Administrador',
            },
            {
              nombre: 'Item',
              modelo: 'Item',
              tipo: 'Administrador',
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
