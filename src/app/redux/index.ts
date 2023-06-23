import { usuarioReducer } from './reducers/usuario.reducer';
import { menuReducer } from './reducers/menu.reducer';
import { empresaReducer } from './reducers/empresa.reducer';


export const StoreApp = {
  usuario: usuarioReducer,
  menu: menuReducer,
  empresa: empresaReducer
}
