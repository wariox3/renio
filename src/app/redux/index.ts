import { usuarioReducer } from './reducers/usuario.reducer';
import { menuReducer } from './reducers/menu.reducer';
import { inquilinoReducer } from './reducers/Inquilino.reducer';
import { InquilinoEffects } from './efectos/InquilinoEffects';
import { UsuarioEffects } from './efectos/UsuarioEffects';

export const StoreApp = {
  usuario: usuarioReducer,
  menu: menuReducer,
  empresa: inquilinoReducer,
};

export const EffectsApp = [InquilinoEffects, UsuarioEffects];
