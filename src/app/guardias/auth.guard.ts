import { inject } from '@angular/core';
import {
  Router,
  CanMatchFn,
} from '@angular/router';
import { Empresa } from '@interfaces/usuario/empresa';
import { TokenService } from '@modulos/auth/services/token.service';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';

export const AutentificacionGuard: CanMatchFn = () => {
  const tokenValido = inject(TokenService).validarToken();
  const tokenEmpresaValido = inject(EmpresaService).validarToken();
  const cookieEmpresa = inject(EmpresaService).obtenerToken();
  const router = inject(Router);
  console.log({tokenEmpresaValido, cookieEmpresa});

  if (tokenValido) {
     if (tokenEmpresaValido) {
      if(cookieEmpresa){
        let empresa: Empresa = JSON.parse(cookieEmpresa)
        console.log(empresa.nombre);
        return true
      }
      return true
     }
    return true
  }

  router.navigate(['/auth/login'])
  return false;
};
