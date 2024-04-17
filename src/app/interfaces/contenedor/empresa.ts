import { TipoIdentificacionLista } from '@interfaces/general/tipoIdentificacion';

export interface Empresa {
  id: number;
  numero_identificacion: string;
  digito_verificacion: string;
  nombre_corto: string;
  direccion: string;
  telefono: string;
  correo: string;
  imagen: string;
  ciudad: number;
  ciudad_nombre?: string;
  identificacion: number;
  regimen: number;
  tipo_persona: number;
  suscriptor: number;
  ciudad_id: number;
  identificacion_id: number;
  rededoc_id: string;
}
