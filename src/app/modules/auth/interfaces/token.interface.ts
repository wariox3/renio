import { Usuario } from '@interfaces/usuario/usuario';
export interface Token {
  'refresh-token': string;
  token: string;
  user: Usuario;
}
