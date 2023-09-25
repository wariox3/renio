import { usuarioReducer } from './reducers/usuario.reducer';
import { menuReducer } from './reducers/menu.reducer';
import { contendorReducer } from './reducers/contendor.reducer';
import { ContenedorEffects } from './efectos/contenedorEffects';
import { UsuarioEffects } from './efectos/UsuarioEffects';
import { empresaReducer } from './reducers/empresa.reducer';

export const StoreApp = {
  usuario: usuarioReducer,
  menu: menuReducer,
  contenedor: contendorReducer,
  empresa: empresaReducer
};

export const EffectsApp = [ContenedorEffects, UsuarioEffects];
