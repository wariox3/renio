type ComponentImport = {
  [key: string]: Promise<{ default: any }>;
};

export const componeteNuevos: ComponentImport = {
  'Item-ItemNuevo': import('../../modules/general/componentes/item/item-nuevo/item-nuevo.component'),
  'Factura-FacturaNuevo': import('../../modules/factura/componentes/factura-nuevo/factura-nuevo.component'),
  'Contacto-ContactoNuevo' : import('../../modules/general/componentes/contacto/contacto-nuevo/contacto-nuevo.component')
};


export const componeteDetalle: ComponentImport = {
  'Item-ItemDetalle': import('../../modules/general/componentes/item/item-detalle/item-detalle.component'),
  'Contacto-ContactoDetalle': import('../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'),
};
