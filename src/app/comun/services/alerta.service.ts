import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertaService {

  constructor() { }

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

  mensajeValidacion(userName: string) {
    Swal.fire({
      title: '<strong>Proceso de verificación</strong>',
      icon: 'info',
      html: 'Sé a envío un correo de verificación',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      timer: 5000,
      timerProgressBar: true,
      cancelButtonText: 'reenviar correo',
      cancelButtonAriaLabel: 'Thumbs down',
      confirmButtonText: 'Aceptar',
      confirmButtonAriaLabel: 'aceptar',
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        this.mensajaExitoso(
          'Correo de verificación',
          `Se ha enviado un correo a ${userName}`
        );
      }
    });
  }
}
