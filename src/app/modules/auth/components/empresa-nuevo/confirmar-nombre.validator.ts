import { AbstractControl } from '@angular/forms';
import { EmpresaService } from '../../services/empresa.service';
export class ConfirmarNombreValidator {
  constructor(private empresaService: EmpresaService) {}

  consultarExistencia(){
    return console.log("asd")
  }

  static validarNombre(control: AbstractControl) {
    const clave = control.get('clave')?.value;
    const confimarClave = control.get('confirmarClave')?.value;

    if (clave !== confimarClave) {
      control.get('confirmarClave')?.setErrors({ clavesDiferentes: true });
    }
  }
}
