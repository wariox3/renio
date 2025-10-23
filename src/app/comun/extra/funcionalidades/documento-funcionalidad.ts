interface ComponentesExtrasAsincronos {
  [key: number | string]: {
    [key: number | string]: {
      componente: () => Promise<{ default: any }>;
    };
  };
}

export const ComponentesExtras: ComponentesExtrasAsincronos = {
  100: {
    recurrente: {
      componente: async () =>
        await import(
          '../../../modules/venta/paginas/documento/extras/recurrente-venta/recurrente-venta.component'
        ),
    },
  },
  103: {
    generar: {
      componente: async () =>
        await import(
          '../../../modules/venta/paginas/documento/extras/generar/generar.component'
        ),
    },
    generarSeleccionados: {
      componente: async () =>
        await import(
          '../../../modules/compra/paginas/documento/extras/generar-seleccionados/generar-seleccionados.component'
        ),
    },
  },
  300: {
    recurrente: {
      componente: async () =>
        await import(
          '../../../modules/compra/paginas/documento/extras/recurrente/recurrente.component'
        ),
    },
    importarZip: {
      componente: async () =>
        await import(
          '../../../modules/compra/paginas/documento/extras/importar-zip-factura-compra/importar-zip-factura-compra'
        ),
    }
  },
  305: {
    generar: {
      componente: async () =>
        await import(
          '../../../modules/compra/paginas/documento/extras/generar/generar.component'
        ),
    },
    generarSeleccionados: {
      componente: async () =>
        await import(
          '../../../modules/compra/paginas/documento/extras/generar-seleccionados/generar-seleccionados.component'
        ),
    },
  },
  702: {
    generar: {
      componente: async () =>
        await import(
          '../../../modules/humano/paginas/documento/extras/generar/generar.component'
        ),
    },
  },
};
