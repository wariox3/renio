export interface Contenedor {
  id: number;
  usuario_id: number;
  contenedor_id: number;
  rol: string;
  subdominio: string;
  nombre: string;
  imagen: string;
  usuarios: number;
  usuarios_base: number;
  plan_id: number;
  plan_nombre: string;
  reddoc: boolean;
  ruteo: boolean;
  acceso_restringido: boolean;
  seleccion: boolean;
}

export interface RespuestaConectar {
  id: number;
  subdominio: string;
  nombre: string;
  plan_id: number;
  plan_usuarios_base: number;
  plan_limite_usuarios: number;
  plan_nombre: string;
  plan_venta: boolean;
  plan_compra: boolean;
  plan_tesoreria: boolean;
  plan_cartera: boolean;
  plan_inventario: boolean;
  plan_humano: boolean;
  plan_contabilidad: boolean;
  imagen: string;
  reddoc: boolean;
  ruteo: boolean;
  cortesia: boolean;
  usuario_id: number;
  acceso_restringido: boolean;
}

export interface Modulos {
  plan_venta: boolean;
  plan_compra: boolean;
  plan_tesoreria: boolean;
  plan_cartera: boolean;
  plan_inventario: boolean;
  plan_humano: boolean;
  plan_contabilidad: boolean;
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
