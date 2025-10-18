import { ConfiguracionModal } from "./configuracion-modal.interface";

export interface BotonesExtras {
  componenteNombre: string;
  nombreBoton: string;
  configuracionModal?: ConfiguracionModal;
  emitirValorCheck?: boolean;
  registrosSeleccionados?: number[];
  esModal?: boolean;
}
