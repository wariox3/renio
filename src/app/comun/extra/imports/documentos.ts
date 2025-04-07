import { FormulariosDetalles } from '@comun/type/mapeo-formulario-detalle.type';

export const Componentes: Partial<FormulariosDetalles> = {
  100: {
    detalle: async () =>
      await import(
        '../../../modules/venta/paginas/documento/factura/factura-detalle/factura-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/paginas/documento/factura/factura-formulario/factura-formulario.component'
      ),
  },
  101: {
    detalle: async () =>
      await import(
        '../../../modules/venta/paginas/documento/nota-credito/nota-credito-detalle/nota-credito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/paginas/documento/nota-credito/nota-credito-formulario/nota-credito-formulario.component'
      ),
  },
  102: {
    detalle: async () =>
      await import(
        '../../../modules/venta/paginas/documento/nota-debito/nota-debito-detalle/nota-debito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/paginas/documento/nota-debito/nota-debito-formulario/nota-debito-formulario.component'
      ),
  },
  103: {
    detalle: async () =>
      await import(
        '../../../modules/venta/paginas/documento/factura-recurrente/factura-recurrente-detalle/factura-recurrente-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/paginas/documento/factura-recurrente/factura-recurrente-formulario/factura-recurrente-formulario.component'
      ),
  },
  104: {
    detalle: async () =>
      await import(
        '../../../modules/venta/paginas/documento/cuenta-cobro/cuenta-cobro-detalle/cuenta-cobro-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/paginas/documento/cuenta-cobro/cuenta-cobro-formulario/cuenta-cobro-formulario.component'
      ),
  },
  105: {
    detalle: async () =>
      await import(
        '../../../modules/venta/paginas/documento/factura-pos/factura-pos-detalle/factura-pos-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/venta/paginas/documento/factura-pos/factura-pos-formulario/factura-pos-formulario.component'
      ),
  },
  200: {
    detalle: async () =>
      await import(
        '../../../modules/cartera/paginas/documento/pago/pago-detalle/pago-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/cartera/paginas/documento/pago/pago-formulario/pago-formulario.component'
      ),
  },
  300: {
    detalle: async () =>
      await import(
        '../../../modules/compra/paginas/documento/factura/factura-detalle/factura-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/paginas/documento/factura/factura-formulario/factura-formulario.component'
      ),
  },
  301: {
    detalle: async () =>
      await import(
        '../../../modules/compra/paginas/documento/nota-credito/nota-credito-detalle/nota-credito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/paginas/documento/nota-credito/nota-credito-formulario/nota-credito-formulario.component'
      ),
  },
  302: {
    detalle: async () =>
      await import(
        '../../../modules/compra/paginas/documento/nota-debito/nota-debito-detalle/nota-debito-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/paginas/documento/nota-debito/nota-debito-formulario/nota-debito-formulario.component'
      ),
  },
  303: {
    detalle: async () =>
      await import(
        '../../../modules/compra/paginas/documento/documento-soporte/documento-soporte-detalle/documento-soporte-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/paginas/documento/documento-soporte/documento-soporte-formulario/documento-soporte-formulario.component'
      ),
  },
  304: {
    detalle: async () =>
      await import(
        '../../../modules/compra/paginas/documento/nota-ajuste/nota-ajuste-detalle/nota-ajuste-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/compra/paginas/documento/nota-ajuste/nota-ajuste-formulario/nota-ajuste-formulario.component'
      ),
  },
  400: {
    detalle: async () =>
      await import(
        '../../../modules/tesoreria/paginas/documento/egreso/egreso-detalle/egreso-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/tesoreria/paginas/documento/egreso/egreso-formulario/egreso-formulario.component'
      ),
  },
  500: {
    detalle: async () =>
      await import(
        '../../../modules/inventario/paginas/documento/entrada/entrada-detalle/entrada-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/inventario/paginas/documento/entrada/entrada-formulario/entrada-formulario.component'
      ),
  },
  501: {
    detalle: async () =>
      await import(
        '../../../modules/inventario/paginas/documento/salida/salida-detalle/salida-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/inventario/paginas/documento/salida/salida-formulario/salida-formulario.component'
      ),
  },
  601: {
    detalle: async () =>
      await import(
        '../../../modules/contabilidad/paginas/documento/asiento/asiento-detalle/asiento-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/paginas/documento/asiento/asiento-formulario/asiento-formulario.component'
      ),
  },
  602: {
    detalle: async () =>
      await import(
        '../../../modules/contabilidad/paginas/documento/depreciacion/depreciacion-detalle/depreciacion-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/paginas/documento/depreciacion/depreciacion-formulario/depreciacion-formulario.component'
      ),
  },
  603: {
    detalle: async () =>
      await import(
        '../../../modules/contabilidad/paginas/documento/cierre/cierre-detalle/cierre-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/paginas/documento/cierre/cierre-formulario/cierre-formulario.component'
      ),
  },
  701: {
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/documento/pago/pago-detalle/pago-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/contabilidad/paginas/documento/asiento/asiento-formulario/asiento-formulario.component'
      ),
  },
  702: {
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/documento/nomina-electronica/nominaElectronicaDetalle/nominaElectronicaDetalle.component'
      ),
    formulario: function (): Promise<{ default: any }> {
      throw new Error('Function not implemented.');
    },
  },
  703: {
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/documento/seguridad-social/seguridad-social-detalle.component'
      ),
    formulario: function (): Promise<{ default: any }> {
      throw new Error('Function not implemented.');
    },
  },
  HumProgramacion: {
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/documento/programacion/programacion-detalle/programacion-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/paginas/documento/programacion/programacion-formulario/programacion-formulario.component'
      ),
  },
  HumAporte: {
    detalle: async () =>
      await import(
        '../../../modules/humano/paginas/documento/aporte/aporte-detalle/aporte-detalle.component'
      ),
    formulario: async () =>
      await import(
        '../../../modules/humano/paginas/documento/aporte/aporte-formulario/aporte-formulario.component'
      ),
  },
};
