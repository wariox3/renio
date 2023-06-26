interface Verificacion {
  codigoUsuario: string;
  token: string;
  vence: string;
}


export interface TokenReenviarValidacion {
  verificacion: Verificacion;
}

