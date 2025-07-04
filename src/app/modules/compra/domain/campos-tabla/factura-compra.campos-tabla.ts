import { ColumnaTabla } from '@comun/componentes/agregar-detalles-documento/agregar-detalles-documento.component';

export const FACTURA_COMPRAS_CAMPOS_TABLA: ColumnaTabla[] = [
  {
    id: 'documento__numero',
    titulo: 'numero',
    campo: 'documento__numero',
  },
  {
    id: 'documento__documento__tipo__nombre',
    titulo: 'tipo',
    campo: 'documento__documento__tipo__nombre',
  },
  {
    id: 'documento__contacto__nombre_corto',
    titulo: 'contacto',
    campo: 'documento__contacto__nombre_corto',
  },
  {
    id: 'item__nombre',
    titulo: 'item',
    campo: 'item__nombre',
  },
  {
    id: 'cantidad',
    titulo: 'cantidad',
    campo: 'cantidad',
  },
  {
    id: 'precio',
    titulo: 'precio',
    campo: 'precio',
  },
];
