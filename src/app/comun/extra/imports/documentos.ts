type FormulariosYDetallesAsíncronos = {
  [key: number]: {
    detalle: () => Promise<{ default: any }>;
    formulario: () => Promise<{ default: any }>;
  };
};

export const Componetes: FormulariosYDetallesAsíncronos = {
  100: {
    detalle: async () =>
      await import(
        '../../../modules/venta/componentes/factura/factura-detalle/factura-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/componentes/factura/factura-formulario/factura-formulario.component'
      ),
  },
  101: {
    detalle: async () =>
      await import(
        '../../../modules/venta/componentes/nota-credito/nota-credito-detalle/nota-credito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/componentes/nota-credito/nota-credito-formulario/nota-credito-formulario.component'
      ),
  },
  102: {
    detalle: async () =>
      await import(
        '../../../modules/venta/componentes/nota-debito/nota-debito-detalle/nota-debito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/componentes/nota-debito/nota-debito-formulario/nota-debito-formulario.component'
      ),
  },
  200: {
    detalle: async () =>
      await import(
        '../../../modules/cartera/componentes/pago/pago-detalle/pago-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/cartera/componentes/pago/pago-formulario/pago-formulario.component'
      ),
  },
  300: {
    detalle: async () =>
      await import(
        '../../../modules/compra/componentes/factura/factura-detalle/factura-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/componentes/factura/factura-formulario/factura-formulario.component'
      ),
  },
  301: {
    detalle: async () =>
      await import(
        '../../../modules/compra/componentes/nota-credito/nota-credito-detalle/nota-credito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/componentes/nota-credito/nota-credito-formulario/nota-credito-formulario.component'
      ),
  },
  302: {
    detalle: async () =>
      await import(
        '../../../modules/compra/componentes/nota-debito/nota-debito-detalle/nota-debito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/componentes/nota-debito/nota-debito-formulario/nota-debito-formulario.component'
      ),
  },
  400: {
    detalle: async () =>
      await import(
        '../../../modules/tesoreria/componentes/egreso/egreso-detalle/egreso-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/tesoreria/componentes/egreso/egreso-formulario/egreso-formulario.component'
      ),
  },
  500: {
    detalle: async () =>
      await import(
        '../../../modules/inventario/componentes/entrada/entrada-detalle/entrada-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/inventario/componentes/entrada/entrada-formulario/entrada-formulario.component'
      ),
  },
  501: {
    detalle: async () =>
      await import(
        '../../../modules/inventario/componentes/salida/salida-detalle/salida-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/inventario/componentes/salida/salida-formulario/salida-formulario.component'
      ),
  },
};
