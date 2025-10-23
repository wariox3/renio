import { Contacto } from "@interfaces/general/contacto"

export interface RespuestaImportarZipFacturaCompra {
  contacto: Contacto,
  referencia_cue: string,
  referencia_numero: string,
  referencia_prefijo: string,
  fecha: string,
  comentario: string,
}
