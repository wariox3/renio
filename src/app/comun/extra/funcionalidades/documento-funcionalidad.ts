interface ComponentesExtrasAsincronos {
  [key: number | string]: {
    [key: number | string]: {
      componente: () => Promise<{ default: any }>;
    };
  };
}

export const ComponentesExtras: ComponentesExtrasAsincronos = {
  103: {
    generar: {
      componente: async () =>
        await import(
          '../../../modules/venta/paginas/documento/extras/generar/generar.component'
        ),
    },
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
          '../../../modules/compra/paginas/documento/extras/generarSeleccionados/generarSeleccionados.component'
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
