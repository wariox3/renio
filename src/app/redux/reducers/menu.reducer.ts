import { createReducer, on } from '@ngrx/store';
import {
  ActualizarCampoMapeo,
  ActualizarMapeo,
  selecionModuloAction,
} from '../actions/menu.actions';

export interface informacionMenuItem {
  nombre: string;
  tipo?: string;
  data?: {
    [key: string]: any;
  };
  children?: informacionMenuItem[];
}

export interface Menu {
  seleccion: string;
  informacion: informacionMenuItem[];
  dataMapeo: any[];
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
              data: { documento_clase: 1 },
            },
            {
              nombre: 'NOTACREDITO',
              tipo: 'Documento',
              data: { documento_clase: 2 },
            },
            {
              nombre: 'NOTADEBITO',
              tipo: 'Documento',
              data: { documento_clase: 3 },
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
              tipo: 'Documento',
              data: { documento_clase: 1 },
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
    dataMapeo
  }))
);
