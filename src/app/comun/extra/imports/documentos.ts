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
        '../../../modules/venta/componentes/documento/factura/factura-detalle/factura-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/componentes/documento/factura/factura-formulario/factura-formulario.component'
      ),
  },
  101: {
    detalle: async () =>
      await import(
        '../../../modules/venta/componentes/documento/nota-credito/nota-credito-detalle/nota-credito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/componentes/documento/nota-credito/nota-credito-formulario/nota-credito-formulario.component'
      ),
  },
  102: {
    detalle: async () =>
      await import(
        '../../../modules/venta/componentes/documento/nota-debito/nota-debito-detalle/nota-debito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/componentes/documento/nota-debito/nota-debito-formulario/nota-debito-formulario.component'
      ),
  },
  200: {
    detalle: async () =>
      await import(
        '../../../modules/cartera/componentes/documento/pago/pago-detalle/pago-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/cartera/componentes/documento/pago/pago-formulario/pago-formulario.component'
      ),
  },
  300: {
    detalle: async () =>
      await import(
        '../../../modules/compra/componentes/documento/factura/factura-detalle/factura-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/componentes/documento/factura/factura-formulario/factura-formulario.component'
      ),
  },
  301: {
    detalle: async () =>
      await import(
        '../../../modules/compra/componentes/documento/nota-credito/nota-credito-detalle/nota-credito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/componentes/documento/nota-credito/nota-credito-formulario/nota-credito-formulario.component'
      ),
  },
  302: {
    detalle: async () =>
      await import(
        '../../../modules/compra/componentes/documento/nota-debito/nota-debito-detalle/nota-debito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/componentes/documento/nota-debito/nota-debito-formulario/nota-debito-formulario.component'
      ),
  },
  303: {
    detalle: async () =>
      await import(
        '../../../modules/compra/componentes/documento/documento-soporte/documento-soporte-detalle/documento-soporte-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/componentes/documento/documento-soporte/documento-soporte-formulario/documento-soporte-formulario.component'
      ),
  },
  304: {
    detalle: async () =>
      await import(
        '../../../modules/compra/componentes/documento/nota-ajuste/nota-ajuste-detalle/nota-ajuste-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/componentes/documento/nota-ajuste/nota-ajuste-formulario/nota-ajuste-formulario.component'
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
