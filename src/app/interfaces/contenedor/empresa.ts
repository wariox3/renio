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
}
