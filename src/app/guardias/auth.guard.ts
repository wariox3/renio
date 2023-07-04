import { inject } from '@angular/core';
import {
  Router,
  CanMatchFn,
} from '@angular/router';
import { Empresa } from '@interfaces/usuario/empresa';
import { TokenService } from '@modulos/auth/services/token.service';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { getCookie } from 'typescript-cookie';

export const AutentificacionGuard: CanMatchFn = () => {
  const tokenValido = inject(TokenService).validarToken();
  const tokenEmpresaValido = inject(EmpresaService).validarToken();
  const empresaCookie = getCookie('empresa');


  const router = inject(Router);
  console.log({tokenEmpresaValido, empresaCookie});

  if (tokenValido) {
     if (tokenEmpresaValido) {
      if(empresaCookie){
        const decodedValue = decodeURIComponent(empresaCookie);

        const empresaObj = JSON.parse(decodedValue);
        console.log(empresaObj.nombre);
        return true
      }
      return true
     }
    return true
  }

  router.navigate(['/auth/login'])
  return false;
};
