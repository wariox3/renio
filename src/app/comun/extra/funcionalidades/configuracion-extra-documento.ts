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
  300: {
    botones: [
      {
        componenteNombre: 'recurrente',
        nombreBoton: 'Recurrente',
        configuracionModal: {
          size: 'xl',
          titulo: 'Recurrente',
        },
      },
    ],
  },
  305: {
    botones: [
      {
        componenteNombre: 'generar',
        nombreBoton: 'Generar todos',
        esModal: false,
        realizarPeticion: false,
        configuracionModal: {
          size: 'sm',
          titulo: 'Generar masivo',
        },
      },
      {
        componenteNombre: 'generarSeleccionados',
        nombreBoton: 'Generar seleccionados',
        realizarPeticion: true,
        esModal: false,
        emitirValorCheck: true,
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
