import { AbstractControl, Validators } from '@angular/forms';

export class MultiplesEmailValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static validarCorreos(control: AbstractControl){
    const campCorreo = control.get('correo')?.value
    if(campCorreo){
      const correo = campCorreo.split(';');
      correo.map((item: any)=> {
        if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(item) === false) {
          control.get('correo')?.setErrors({ pattern: true });
        }
      })
    }
  }

}
