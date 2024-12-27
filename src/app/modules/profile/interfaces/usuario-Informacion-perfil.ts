import { Usuario } from "@interfaces/usuario/usuario";

export interface UsuarioInformacionPerfil extends Partial<Usuario>{
  indicativoPais: string;
}
