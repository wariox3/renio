export interface ContenedorLista {
  id: number;
  rol: string;
  contenedor: string;
  contenedor_id: number;
  contenedor__nombre: string;
  contenedor__usuarios: number;
  contenedor__imagen: string;
  contenedor__schema_name: string;
  contenedor__reddoc: boolean;
  contenedor__ruteo: boolean;
  contenedor__cortesia: boolean;
  contenedor__plan_id: number;
  contenedor__plan__nombre: string;
  contenedor__plan__usuarios_base: number;
  usuario_id: number;
  seleccion: boolean;
  acceso_restringido: boolean;
}

export interface Contenedor {
  id: number;
  usuario_id: number;
  contenedor_id: number;
  rol: string;
  subdominio: string;
  nombre: string;
  imagen: string;
  plan_usuarios_base?: number;
  usuarios: number;
  usuarios_base: number;
  plan_id: number;
  plan_nombre: string;
  reddoc: boolean;
  ruteo: boolean;
  acceso_restringido: boolean;
  seleccion: boolean;
}

export interface ContenedorConfiguracionUsuario {
  usuario: number;
  usuario__nombre: string;
  usuario__username: string;
  usuario__operacion_id: number;
  usuario__operacion_cargo_id: number;
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
  aplicacion: string;
  usuario_id: number;
  invitado: string;
}

export interface ContenedorInvitacionLista {
  id: number;
  usuario: number;
  usuario__nombre: string;
  usuario__username: string;
  contenedor: number;
  rol: string;
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
