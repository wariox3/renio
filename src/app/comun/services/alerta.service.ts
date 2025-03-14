import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { from, Observable } from 'rxjs';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  constructor(private translateService: TranslateService) {}

  mensajeError(title: string, text: string) {
    Swal.fire({
      title,
      html: text,
      icon: 'error',
      position: 'bottom-right',
      toast: true,
      timer: 20000,
      showConfirmButton: true,
      timerProgressBar: true,
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#d9214e',
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    });
  }

  async mensajaExitoso(text: string) {
    return await Swal.fire({
      title: this.translateService.instant(
        'FORMULARIOS.MENSAJES.COMUNES.EXITOSO'
      ),
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

  async mensajaEspera(
    text: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info'
  ) {
    return await (Swal.fire({
      html: text,
      icon,
      timerProgressBar: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    }),
    Swal.showLoading());
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
    inputLabel: string,
    confirmButtonText: string,
    cancelButtonText: string
  ) {
    const mensaje = await Swal.fire({
      title,
      icon: 'warning',
      html,
      cancelButtonText,
      confirmButtonText,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonColor: '#f1416c',
      input: 'text',
      inputLabel: `${inputLabel}${empresaNombre}`,
      didOpen: () => {
        // Deshabilitar el botón de confirmar
        Swal.getConfirmButton()?.setAttribute('disabled', 'true');
        // Configurar el foco del input
        const input = Swal.getInput();
        if (input) {
          input.focus(); // Establecer el foco en el input
          input.oninput = () => {
            if (Swal.getInput()?.value === empresaNombre) {
              Swal.getConfirmButton()?.removeAttribute('disabled');
            } else {
              Swal.getConfirmButton()?.setAttribute('disabled', 'true');
            }
          };
        }
      },
    });
    return mensaje;
  }

  cerrarMensajes() {
    return Swal.close();
  }

  mensajeVisible() {
    return Swal.isVisible();
  }

  async mensajaContactoLandinpage(text: string) {
    return await Swal.fire({
      html: text,
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    }).then(() => {
      window.location.href = '/';
    });
  }

  async confirmar(configuracion: {
    titulo: string;
    texto: string;
    textoBotonCofirmacion: string;
  }) {
    return await Swal.fire({
      title: configuracion.titulo,
      icon: "warning",
      text: configuracion.texto,
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#b8b9ba',
      confirmButtonText: configuracion.textoBotonCofirmacion,
      cancelButtonText: 'Cancelar',
    });
  }

  confirmarSinReversa(): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        title: '¿Está seguro de que desea aprobar el registro?',
        text: ' Esta acción es irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1B84FF',
        cancelButtonColor: '#F8285A',
        reverseButtons: true,
        allowOutsideClick: false,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      })
    );
  }

  anularSinReversa(): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        title: '¿Está seguro de que desea anular el registro?',
        text: ' Esta acción es irreversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#1B84FF',
        cancelButtonColor: '#F8285A',
        reverseButtons: true,
        allowOutsideClick: false,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      })
    );
  }

  confimarConfigracionPrederminada(): Observable<SweetAlertResult> {
    return from(
      Swal.fire({
        title: 'Configuración rápida',
        text: ' Establece los valores predeterminados y haz que el sistema funcione al instante.',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#1B84FF',
        cancelButtonColor: '#F8285A',
        reverseButtons: true,
        allowOutsideClick: false,
        confirmButtonText: 'Confirmar',
        denyButtonText: `Cancelar`,
      })
    );
  }
}
