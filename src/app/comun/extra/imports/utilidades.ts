 type UtilidadesAsíncronos = {
   [key: string]: {
     utilidad: () => Promise<{ default: any }>;
   };
};

 export const Componetes = {
 FACTURAELECTRONICA: {
//     utilidad: async () =>
//       await import(
//         '../../../modules/venta/componentes/utilidades/factura-electronica/factura-electronica.component'
//       ).then((c) => c.FacturaElectronicaComponent),
  },
};
