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
          nombre: 'movimiento',
          children:[
            {
              nombre: 'FACTURACOMPRA',
              url: 'lista',
              modelo: 'Factura',
              tipo: 'Documento',
              data: { formulario: 'FacturaNuevo' },
            },
          ]
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
          nombre: 'movimiento',
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
          nombre: 'movimiento',
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
              nombre: 'Contacto',
              url: 'lista',
              modelo: 'Contacto',
              tipo: 'Administrador',
            },
            {
              nombre: 'Item',
              url: 'lista',
              modelo: 'Item',
              tipo: 'Administrador',
            },
            {
              nombre: 'Precio',
              url: 'lista',
              modelo: 'Precio',
              tipo: 'Administrador',
            },
            {
              nombre: 'Asesor',
              url: 'lista',
              modelo: 'Asesor',
              tipo: 'Administrador',
            },
            {
              nombre: 'Resolucion',
              url: 'lista',
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
          nombre: 'movimiento',
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
              nombre: 'Contacto',
              url: 'lista',
              modelo: 'Contacto',
              tipo: 'Administrador',
            },
            {
              nombre: 'Item',
              url: 'lista',
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
  on(selecionModuloAction, (state, { seleccion }) => (
    
    {
    ...state,
    seleccion,
    }
  ))
);
