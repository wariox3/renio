import { FormulariosDetalles } from '@comun/type/mapeo-formulario-detalle.type';

export const Componentes: Partial<FormulariosDetalles>  = {
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
  103: {
    detalle: async () =>
      await import(
        '../../../modules/venta/componentes/documento/factura-recurrente/factura-recurrente-detalle/factura-recurrente-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/componentes/documento/factura-recurrente/factura-recurrente-formulario/factura-recurrente-formulario.component'
      ),
  },
  104: {
    detalle: async () =>
      await import(
        '../../../modules/venta/componentes/documento/cuenta-cobro/cuenta-cobro-detalle/cuenta-cobro-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/componentes/documento/cuenta-cobro/cuenta-cobro-formulario/cuenta-cobro-formulario.component'
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
        '../../../modules/tesoreria/componentes/documento/egreso/egreso-detalle/egreso-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/tesoreria/componentes/documento/egreso/egreso-formulario/egreso-formulario.component'
      ),
  },
  500: {
    detalle: async () =>
      await import(
        '../../../modules/inventario/componentes/documento/entrada/entrada-detalle/entrada-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/inventario/componentes/documento/entrada/entrada-formulario/entrada-formulario.component'
      ),
  },
  501: {
    detalle: async () =>
      await import(
        '../../../modules/inventario/componentes/documento/salida/salida-detalle/salida-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/inventario/componentes/documento/salida/salida-formulario/salida-formulario.component'
      ),
  },
  601: {
    detalle: async () =>
      await import(
        '../../../modules/contabilidad/componentes/documento/asiento/asiento-detalle/asiento-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/componentes/documento/asiento/asiento-formulario/asiento-formulario.component'
      ),
  },
  701: {
    detalle: async () =>
      await import(
        '../../../modules/humano/componentes/documento/pago/pago-detalle/pago-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/componentes/documento/asiento/asiento-formulario/asiento-formulario.component'
      ),
  },
  702: {
    detalle: async () =>
      await import(
        '../../../modules/humano/componentes/documento/nomina-electronica/nominaElectronicaDetalle/nominaElectronicaDetalle.component'
      ),
      formulario: function (): Promise<{ default: any; }> {
        throw new Error('Function not implemented.');
      }
  },
  HumProgramacion: {
    detalle: async () =>
      await import(
        '../../../modules/humano/componentes/documento/programacion/programacion-detalle/programacion-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/componentes/documento/programacion/programacion-formulario/programacion-formulario.component'
      ),
  },
  HumAdicional: {
    detalle: async () =>
      await import(
        '../../../modules/humano/componentes/documento/adicional/adicional-detalle/adicional-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/componentes/documento/adicional/adicional-formulario/adicional-formulario.component'
      ),
  },
  HumCredito: {
    detalle: async () =>
      await import(
        '../../../modules/humano/componentes/documento/credito/credito-detalle/credito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/componentes/documento/credito/credito-formulario/credito-formulario.component'
      ),
  },
  HumNovedad: {
    detalle: async () =>
      await import(
        '../../../modules/humano/componentes/documento/novedad/novedad-detalle/novedad-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/componentes/documento/novedad/novedad-formulario/novedad-formulario.component'
      ),
  },
  HumAporte: {
    detalle: async () =>
      await import(
        '../../../modules/humano/componentes/documento/aporte/aporte-detalle/aporte-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/componentes/documento/aporte/aporte-formulario/aporte-formulario.component'
      ),
  }
};
