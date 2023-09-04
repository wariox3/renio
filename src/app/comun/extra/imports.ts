type ComponentImport = {
  [key: string]: Promise<{ default: any }>;
};

export const componeteNuevos: ComponentImport = {
  'Item-ItemDetalle': import('../../modules/general/componentes/item/item-detalle/item-detalle.component'),
  'Factura-FacturaDetalle': import('../../modules/venta/componentes/factura-detalle/factura-detalle.component'),
  'Contacto-ContactoDetalle' : import('../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component')
};


