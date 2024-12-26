export interface RecuperarClaveVerificacion {
  id: number;
  codigoUsuario: string;
  token: string;
  vence: string;
  estado_usado: false;
  accion: string;
  usuario_id: number;
  contenedor_id: string | null;
  usuario_invitado_username: string | null;
}
