export interface ContactoNuevo {
  numero_identificacion: string;
  digito_verificacion: string | null;
  nombre_corto: string;
  nombre1: string | null;
  nombre2: string | null;
  apellido1: string | null;
  apellido2: string | null;
  direccion: string;
  codigo_postal: string | null;
  telefono: string;
  celular: string;
  correo: string;
  identificacion: number;
  ciudad: number;
  tipo_persona: number;
  regimen: number;
}
