import { usuarioReducer } from './reducers/usuario.reducer';
import { menuReducer } from './reducers/menu.reducer';
import { contendorReducer } from './reducers/contendor.reducer';
import { ContenedorEffects } from './effects/contenedor.effects';
import { MenuEffects } from './effects/menu.effects';
import { UsuarioEffects } from './effects/usuario.effects';
import { empresaReducer } from './reducers/empresa.reducer';
import { EmpresaEffects } from './effects/empresa.effects';
import { configuracionReducer } from './reducers/configuracion.reducer';
import { ConfiguracionEffects } from './effects/configuracion.effects';
import { criteriosFiltroReducer } from './reducers/criterios-filtros.reducer';
import { documentacionReducer } from './reducers/documentacion.reducer';
import { DocumentacionEffects } from './effects/documentacion.effects';
import { ArchivoImportacionReducer } from './reducers/archivo-importacion.reducer';
import { ArchivoImportacionEffects } from './effects/archivo-importacion.effects';

export const StoreApp = {
  usuario: usuarioReducer,
  menu: menuReducer,
  contenedor: contendorReducer,
  empresa: empresaReducer,
  configuracion: configuracionReducer,
  criteriosFiltro: criteriosFiltroReducer,
  documentacion: documentacionReducer,
  archivoImportacion: ArchivoImportacionReducer
};

export const EffectsApp = [
  ContenedorEffects,
  UsuarioEffects,
  EmpresaEffects,
  ConfiguracionEffects,
  MenuEffects,
  DocumentacionEffects,
  ArchivoImportacionEffects
];
