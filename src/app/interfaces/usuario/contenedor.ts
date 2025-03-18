export interface Contenedor {
  ciudad: number;
  correo: string;
  direccion: string;
  id: number;
  identificacion: number;
  imagen: string;
  contenedor_id: number;
  nombre: string | null;
  nombre_corto: string;
  numero_identificacion: number;
  plan_id: number;
  plan_nombre: number | null;
  rol: string;
  seleccion?: boolean;
  subdominio: string;
  telefono: string;
  usuario_id: number;
  usuarios: number;
  usuarios_base: number;
  acceso_restringido: boolean;
}

export interface ContenedorLista {
  contenedores: Contenedor[];
}

export interface ContenedorInvitacion {
  contenedor_id: number;
  usuario_id: number;
  invitado: string;
}

export interface ContenedorUsuariosInvicionAceptada
  extends Omit<Contenedor, 'subdominio' | 'imagen' | 'seleccion'> {
  username: string;
}

export interface ContenedorFormulario {
  nombre: string;
  subdominio: string;
  plan_id: Number;
  imagen: string | null;
  numero_identificacion: string;
  nombre_corto: string;
  direccion: string;
  telefono: string;
  correo: string;
  identificacion: string;
  ciudad: string;
  ciudad_nombre: string;
  digito_verificacion: string;
}
