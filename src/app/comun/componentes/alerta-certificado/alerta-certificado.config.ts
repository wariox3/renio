/**
 * Configuración TEMPORAL del aviso de vencimiento del certificado de firma digital.
 *
 * - Para mostrar el aviso: activo = true y ajustar fechaVencimiento.
 * - Para retirarlo: activo = false.
 * - Los días restantes se calculan automáticamente a partir de la fecha.
 */
export const ALERTA_CERTIFICADO_CONFIG = {
  activo: true,
  /** Formato YYYY-MM-DD */
  fechaVencimiento: '2026-11-20',
  /** Días antes del vencimiento en que se empieza a mostrar el aviso */
  diasAnticipacion: 15,
  telefonoSoporte: '3332590638',
};
