export interface Inquilino {
  ciudad: number;
  correo: string;
  direccion: string;
  id: number;
  identificacion: number;
  imagen: string;
  inquilino_id: number;
  nombre: string | null;
  nombre_corto: string;
  numero_identificacion: number;
  plan_id: number | null;
  plan_nombre: number | null;
  rol: string;
  seleccion?: boolean;
  subdominio: string;
  telefono: string;
  usuario_id: number;
  usuarios: number;
  usuarios_base: number | null;
}


export interface InquilinoLista {
  inquilinos: Inquilino[];
}

export interface InquilinoInvitacion {
  inquilino_id: string;
  usuario_id: string;
  invitado: string;
}

export interface InquilinoUsuariosInvicionAceptada extends Omit<Inquilino, 'subdominio' | 'imagen' | 'seleccion'>{
  username: string
}

export interface InquilinoFormulario {
  nombre: string;
  subdominio: string;
  plan_id: Number ,
  imagen: string | null
}
