export interface Contacto {
  identificacion: number;
  numero_identificacion: number;
  identificacion_abreviatura: string;
  nombre_corto: string;
  direccion: string;
  ciudad: number;
  ciudad_nombre: number;
  telefono: number;
  celular: number;
  tipo_persona_id: number;
  tipo_persona: number;
  regimen_id: number;
  regimen_nombre: string;
  digito_verificacion: string | null;
  nombre1: string | null;
  nombre2: string | null;
  apellido1: string | null;
  apellido2: string | null;
  codigo_postal: string | null;
  correo: string;
  codigo_ciuu: string;
  barrio: string,
}

