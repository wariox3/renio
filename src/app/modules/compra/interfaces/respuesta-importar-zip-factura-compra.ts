export interface RespuestaImportarZipFacturaCompra {
  contacto: RespuestaImportarZipContacto,
  documento: RespuestaImportarZipDocumento,
}

export interface RespuestaImportarZipContacto {
  numero_identificacion: string,
  nombre_corto: string,
  contacto_id: number,
  existe: boolean,
  ciudad: string,
  ciudad_id: number,
  correo: string,
  direccion: string,
  tipo_persona: number,
  plazo_pago_id: string,
}

interface RespuestaImportarZipDocumento {
  numero: string,
  prefijo: string,
  cue: string,
  fecha: string,
  fecha_vence: string,
  comentario: string,
  detalles: RespuestaImportarZipDocumentoDetalles[],
}


interface RespuestaImportarZipDocumentoDetalles {
  item: string,
  item_nombre: string,
  cantidad: string,
  precio_unitario: string,
  valor_total: string,
}
