export interface Empresa {
  empresa_id: number;
  id: number;
  imagen: string | null;
  nombre: string | null;
  subdominio: string;
  usuario_id: number;
  seleccion?: boolean
  rol: string
  usuarios: Number,
  plan_id: Number | null,
  plan_nombre : Number | null,
}


export interface EmpresaLista {
  empresas: Empresa[];
}

export interface EmpresaInvitacion {
  empresa_id: string;
  usuario_id: string;
  invitado: string;
}

export interface EmpresaUsuariosInvicionAceptada extends Omit<Empresa, 'subdominio' | 'imagen' | 'seleccion'>{
  username: string
}
