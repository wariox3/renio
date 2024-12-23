import { BotonesExtras } from '@interfaces/comunes/configuracion-extra/configuracion-extra.interface';

interface ConfiguracionExtraDocumento {
  [key: number | string]: {
    botones: BotonesExtras[];
  };
}

export const configuracionExtraDocumento: ConfiguracionExtraDocumento = {
  103: {
    botones: [
      {
        componenteNombre: 'generar',
        nombreBoton: 'Generar',
        configuracionModal: {
          size: 'sm',
          titulo: 'Generar masivo',
        },
      },
    ],
  },
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
