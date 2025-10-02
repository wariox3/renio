import { ColumnaTabla } from '@comun/componentes/agregar-detalles-documento/agregar-detalles-documento.component';

export const FACTURA_COMPRAS_CAMPOS_TABLA: ColumnaTabla[] = [
  {
    id: 'documento__numero',
    titulo: 'Numero',
    campo: 'documento__numero',
  },
  {
    id: 'documento__documento__tipo__nombre',
    titulo: 'Tipo',
    campo: 'documento__documento__tipo__nombre',
  },
  {
    id: 'documento__contacto__nombre_corto',
    titulo: 'Contacto',
    campo: 'documento__contacto__nombre_corto',
  },
  {
    id: 'item__nombre',
    titulo: 'Item',
    campo: 'item__nombre',
  },
  {
    id: 'cantidad',
    titulo: 'Cantidad',
    campo: 'cantidad',
    alineacion: 'derecha',
    formatearValor: (valor: any) => {
      if (valor === null || valor === undefined || valor === '') {
        return '';
      }
      const numero = Number(valor);
      if (isNaN(numero)) {
        return valor;
      }
      return numero.toLocaleString('es-CO');
    },
  },
  {
    id: 'precio',
    titulo: 'Precio',
    campo: 'precio',
    alineacion: 'derecha',
    formatearValor: (valor: any) => {
      if (valor === null || valor === undefined || valor === '') {
        return '';
      }
      // Formatear como número (equivalente al pipe number de Angular)
      const numero = Number(valor);
      if (isNaN(numero)) {
        return valor;
      }
      return numero.toLocaleString('es-CO');
    },
  },
];
