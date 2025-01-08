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
  702: {
    generar: {
      componente: async () =>
        await import(
          '../../../modules/humano/paginas/documento/extras/generar/generar.component'
        ),
    },
  },
};
