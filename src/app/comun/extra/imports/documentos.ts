type FormulariosYDetallesAsíncronos = {
  [key: string]: {
    [key: string]: {
      detalle: () => Promise<{ default: any }>;
      formulario: () => Promise<{ default: any }>;
    };
  };
};

export const Componetes: FormulariosYDetallesAsíncronos = {
  VENTA: {
    100: {
      detalle: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
        ),
      formulario: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
        ),
    },
    101: {
      detalle: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
        ),
      formulario: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
        ),
    },
    102: {
      detalle: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
        ),
      formulario: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
        ),
    },
  },
  CARTERA: {
    200: {
      detalle: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
        ),
      formulario: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
        ),
    }
  },
  COMPRA: {
    300: {
      detalle: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
        ),
      formulario: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
        ),
    },
    301: {
      detalle: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
        ),
      formulario: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
        ),
    },
    302: {
      detalle: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
        ),
      formulario: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
        ),
    },
  },
  TESORERIA: {
    400: {
      detalle: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
        ),
      formulario: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
        ),
    },
  },
  INVENTARIO: {
    500: {
      detalle: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
        ),
      formulario: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
        ),
    },
    501: {
      detalle: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-detalle/contacto-detalle.component'
        ),
      formulario: async () =>
        await import(
          '../../../modules/general/componentes/contacto/contacto-formulario/contacto-formulario.component'
        ),
    },
  },
};
