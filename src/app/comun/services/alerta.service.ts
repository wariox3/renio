import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  constructor() {}

  mensajeError(title: string, text: string) {
    Swal.fire({
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

  mensajaExitoso(title: string, text: string) {
    Swal.fire({
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
}
