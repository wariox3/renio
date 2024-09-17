interface ComponentesExtrasAsincronos {
  [key: number | string]: {
    [key: number | string]: {
      componente: () => Promise<{ default: any }>;
    };
  };
}

export const ComponentesExtras: ComponentesExtrasAsincronos = {
  702: {
    generar: {
      componente: async () =>
        await import(
          '../../../modules/humano/componentes/documento/extras/generar/generar.component'
        ),
    },
  },
};