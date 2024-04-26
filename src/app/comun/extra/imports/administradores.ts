type FormulariosYDetallesAsíncronos = {
  [key: string]: {
    modulo?:
      | 'compra'
      | 'venta'
      | 'contabilidad'
      | 'cartera'
      | 'humano'
      | 'general';
    modelo?: string;
    tipo?: string;
    detalle: () => Promise<{ default: any }>;
    formulario: () => Promise<{ default: any }>;
  };
};

export const Componetes: FormulariosYDetallesAsíncronos = {
  Contacto: {
    modulo: 'general',
    modelo: 'contacto',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
      ),
  },
  Item: {
    modulo: 'general',
    modelo: 'item',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/item/item-detalle/item-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/item/item-formulario/item-formulario.component'
      ),
  },
  Resolucion: {
    modulo: 'general',
    modelo: 'resolucion',
    tipo: 'Administrador',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/resolucion/resolucion-detalle/resolucion-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/resolucion/resolucion-formulario/resolucion-formulario.component'
      ),
  },
  Documento: {
    detalle: async () =>
      await import(
        '../../../modules/venta/componentes/factura/factura-detalle/factura-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/componentes/factura/factura-formulario/factura-formulario.component'
      ),
  },
  Precio: {
    modulo: 'general',
    modelo: 'precio',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/precio/precio-detalle/precio-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/precio/precio-formulario/precio-formulario.component'
      ),
  },
  Asesor: {
    modulo: 'general',
    modelo: 'asesor',
    detalle: async () =>
      await import(
        '../../../modules/general/componentes/asesor/asesor-detalle/asesor-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/general/componentes/asesor/asesor-formulario/asesor-formulario.component'
      ),
  },
};