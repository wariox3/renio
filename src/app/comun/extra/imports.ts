type ComponentImport = {
  [key: string]: Promise<{ default: any }>;
};

export const componeteNuevos: ComponentImport = {
  'Item-formularioItemNuevo': import('../../modules/general/componentes/item/item-nuevo/item-nuevo.component'),
  'Factura-formularioFacturaNuevo': import('../../modules/factura/componentes/factura-nuevo/factura-nuevo.component')
};


export const componeteDetalle: ComponentImport = {
  'Item-formularioItemNuevo': import('../../modules/general/componentes/item/item-nuevo/item-nuevo.component'),
  'Factura-formularioFacturaNuevo': import('../../modules/factura/componentes/factura-nuevo/factura-nuevo.component')
};
