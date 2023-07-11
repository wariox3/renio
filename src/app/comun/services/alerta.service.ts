import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  constructor() {}

  async mensajeError(title: string, text: string) {
    return await Swal.fire({
      title,
      html: text,
      icon: 'error',
      position: 'bottom-right',
      toast: true,
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
  }

  async mensajaExitoso(title: string, text: string) {
    return await Swal.fire({
      title,
      html: text,
      icon: 'success',
      position: 'bottom-right',
      toast: true,
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
  }

  mensajeValidacion(
    title: string,
    html: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info'
  ) {
    return Swal.fire({
      title,
      icon,
      html,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      cancelButtonText: 'Cancelar',
      cancelButtonAriaLabel: 'Thumbs down',
      confirmButtonText: 'Aceptar',
      confirmButtonAriaLabel: 'aceptar',
      confirmButtonColor: '#009EF7',
    });
  }

  async mensajeEliminarEmpresa(
    empresaNombre: string | null,
    title: string,
    html: string,
  ) {
    const mensaje = await Swal.fire({
      title,
      icon: 'warning',
      html,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      cancelButtonText: 'Cancelar',
      cancelButtonAriaLabel: 'Thumbs down',
      confirmButtonText: 'Eliminar',
      confirmButtonAriaLabel: 'aceptar',
      confirmButtonColor: '#f1416c',
      input: 'text',
      inputLabel: `Para confirmar, escriba "${empresaNombre}" en el cuadro de abajo`,
      inputAutoFocus: true,
      didOpen: ()=> {
        //deshabilitar el botton de confirmar
        Swal.getConfirmButton()?.setAttribute('disabled', 'true')
        const input = Swal.getInput()
        if(input){
          input.oninput = () => {
            if(Swal.getInput()?.value === empresaNombre){
              Swal.getConfirmButton()?.removeAttribute('disabled')
            } else {
              Swal.getConfirmButton()?.setAttribute('disabled', 'true')

            }
          }
        }

      }
    });





    return mensaje
  }
}
