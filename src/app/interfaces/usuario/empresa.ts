export interface Empresa {
  empresa_id: number;
  id: number;
  imagen: string;
  nombre: string | null;
  subdominio: string;
  usuario_id: number;
  seleccion?: boolean
  rol: string
  usuarios: number,
  plan_id: number | null,
  plan_nombre : number | null,
  usuarios_base : number | null
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

export interface EmpresaFormulario {
  nombre: string;
  subdominio: string;
  plan_id: Number ,
  imagen: string | null
}
