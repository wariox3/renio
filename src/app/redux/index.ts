import { usuarioReducer } from './reducers/usuario.reducer';
import { menuReducer } from './reducers/menu.reducer';
import { empresaReducer } from './reducers/empresa.reducer';
import { EmpresaEffects } from './efectos/EmpresaEffects';
import { UsuarioEffects } from './efectos/UsuarioEffects';

export const StoreApp = {
  usuario: usuarioReducer,
  menu: menuReducer,
  empresa: empresaReducer,
};

export const EffectsApp = [EmpresaEffects, UsuarioEffects];
