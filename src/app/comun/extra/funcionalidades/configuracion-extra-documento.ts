import { BotonesExtras } from "@interfaces/comunes/configuracionExtra";

interface ConfiguracionExtraDocumento {
  [key: number | string]: { 
    botones: BotonesExtras[]
  }
}

export const configuracionExtraDocumento: ConfiguracionExtraDocumento = {
  702: {
    botones: [
      {
        componenteNombre: 'generar',
        nombreBoton: 'Generar',
        configuracionModal: {
          size: 'sm',
          titulo: 'Generar',
        },
      },
    ],
  },
};
