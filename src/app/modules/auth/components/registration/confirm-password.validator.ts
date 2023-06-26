import { AbstractControl } from '@angular/forms';

export class ConfirmPasswordValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static validarClave(control: AbstractControl){


    const clave = control.get('clave')?.value
    const confimarClave = control.get('confirmarClave')?.value

    if(clave !== confimarClave){
      control.get('confirmarClave')?.setErrors({ clavesDiferentes: true });
    }
  }

}
