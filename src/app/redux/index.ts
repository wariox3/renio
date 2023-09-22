import { usuarioReducer } from './reducers/usuario.reducer';
import { menuReducer } from './reducers/menu.reducer';
import { contendorReducer } from './reducers/contendor.reducer';
import { ContenedorEffects } from './efectos/contenedorEffects';
import { UsuarioEffects } from './efectos/UsuarioEffects';

export const StoreApp = {
  usuario: usuarioReducer,
  menu: menuReducer,
  contenedor: contendorReducer,
};

export const EffectsApp = [ContenedorEffects, UsuarioEffects];
