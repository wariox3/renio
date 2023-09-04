type ComponentImport = {
  [key: string]: Promise<{ default: any }>;
};

export const componeteNuevos: ComponentImport = {
  'Item-ItemNuevo': import('../../modules/general/componentes/item/item-nuevo/item-nuevo.component'),
  'Factura-FacturaDetalle': import('../../modules/venta/componentes/factura-detalle/factura-detalle.component'),
  'Contacto-ContactoDetalle' : import('../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component')
};


