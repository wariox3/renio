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

  static validarCambioClave(control: AbstractControl){

    const clave = control.get('nuevaClave')?.value
    const confimarClave = control.get('confirmarNuevaClave')?.value

    if(clave !== confimarClave){
      control.get('confirmarNuevaClave')?.setErrors({ clavesDiferentes: true });
    }
  }

  static validarClaveDiferentes(control: AbstractControl){

    const claveAnterior = control.get('claveAnterior')?.value
    const nuevaClave = control.get('nuevaClave')?.value

    if(claveAnterior !== '' && nuevaClave !== ''){
      if(claveAnterior === nuevaClave){
        control.get('nuevaClave')?.setErrors({ clavesDiferentes: true });
      }
    }
  }

}
