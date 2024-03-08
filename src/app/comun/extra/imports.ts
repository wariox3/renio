type ComponentImport = {
  [key: string]: Promise<{ default: any }>;
};

export const componeteNuevos: ComponentImport = {
  'Item-ItemNuevoEditar': import(
    '../../modules/general/componentes/item/item-detalle/item-detalle.component'
  ),
  'Item-ItemDetalle': import(
    '../../modules/general/componentes/item/item-detalle/item-detalle.component'
  ),
  'Factura-FacturaDetalle': import(
    '../../modules/venta/componentes/factura-detalle/factura-detalle.component'
  ),
  'Contacto-ContactoDetalle': import(
    '../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
  ),
  'Resolucion-ResolucionDetalle': import(
    '../../modules/general/componentes/resolucion/resolucion-detalle/resolucion-detalle.component'
  ),
};

type ObjetoEjemplo = {
  [key: string]: {
    detalle: Promise<{ default: any }>;
    formulario: Promise<{ default: any }>;
  };
};

export const componeteNuevos2: ObjetoEjemplo = {
  'Contacto': {
    detalle: import(
      '../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
    ),
    formulario: import(
      '../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
    ),
  },
};
