export interface Usuario {
  id: string
  username: string,
  cargo: string,
  imgen: string,
  nombre_corto: string,
  nombre: string | null,
  apellido: string | null,
  telefono: string | null,
  correo: string,
  idioma: string | null,
}