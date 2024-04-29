type UtilidadesAsíncronos = {
  [key: string]: {
    utilidad: () => Promise<{ default: any }>;
  };
};

export const Componetes: UtilidadesAsíncronos = {
  FACTURAELECTRONICA: {
    utilidad: async () =>
      await import(
        '../../../modules/venta/componentes/utilidades/factura-electronica/factura-electronica.component'
      ),
  },
};
