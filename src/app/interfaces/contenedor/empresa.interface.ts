export interface Empresa {
  id: number;
  numero_identificacion: string;
  digito_verificacion: string;
  identificacion_nombre: string;
  nombre_corto: string;
  direccion: string;
  telefono: string;
  correo: string;
  imagen: string;
  ciudad: number;
  ciudad_nombre?: string;
  identificacion: number;
  regimen: number;
  regimen_nombre: string;
  tipo_persona: number;
  tipo_persona_nombre: string;
  suscriptor: number;
  ciudad_id: number;
  identificacion_id: number;
  rededoc_id: string;
  asistente_electronico: boolean;
}
