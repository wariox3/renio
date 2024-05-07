import { usuarioReducer } from './reducers/usuario.reducer';
import { menuReducer } from './reducers/menu.reducer';
import { contendorReducer } from './reducers/contendor.reducer';
import { ContenedorEffects } from './efectos/contenedorEffects';
import { MenuEffects } from './efectos/menuEffecsts';
import { UsuarioEffects } from './efectos/UsuarioEffects';
import { empresaReducer } from './reducers/empresa.reducer';
import { EmpresaEffects } from './efectos/empresaEffects';
import { configuracionReducer } from './reducers/configuracion.reducer';
import { ConfiguracionEffects } from './efectos/configuracionEffects';
import { documentoReducer } from './reducers/documento.reducer';
import { criteriosFiltroReducer } from './reducers/criteriosfiltros.reducer';

export const StoreApp = {
  usuario: usuarioReducer,
  menu: menuReducer,
  contenedor: contendorReducer,
  empresa: empresaReducer,
  configuracion: configuracionReducer,
  documento: documentoReducer,
  criteriosFiltro: criteriosFiltroReducer,
};

export const EffectsApp = [
  ContenedorEffects,
  UsuarioEffects,
  EmpresaEffects,
  ConfiguracionEffects,
  MenuEffects
];
