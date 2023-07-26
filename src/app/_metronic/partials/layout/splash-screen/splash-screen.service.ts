import { ElementRef, Injectable } from '@angular/core';
import { animate, AnimationBuilder, style } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class SplashScreenService {
  // Private properties
  private el: ElementRef;
  private stopped: boolean;

  /**
   * Service constructor
   *
   * @param animationBuilder: AnimationBuilder
   */
  constructor(private animationBuilder: AnimationBuilder) {

    document.addEventListener('DOMContentLoaded', () => {
      // El DOM está listo aquí, pero los estilos externos aún pueden estar cargándose.
      this.initAnimation();
    });

    window.addEventListener('load', () => {
      // Todos los recursos externos, incluidos los estilos, se han cargado.
      // Asegúrate de que los estilos necesarios estén listos antes de iniciar la animación.
      this.initAnimation();
    });
  }

  /**
   * Init
   *
   * @param element: ElementRef
   */
  init(element: ElementRef) {
    this.initAnimation()
    console.log("W yandel");
    
    this.el = element;
  }

  /**
   * Hide
   */
  initAnimation() {
    if (this.stopped || !this.el) {
      return;
    }

    const player = this.animationBuilder
      .build([style({ opacity: '1' }), animate(800, style({ opacity: '0' }))])
      .create(this.el.nativeElement);

    player.onDone(() => {
      if (typeof this.el.nativeElement.remove === 'function') {
        this.el.nativeElement.remove();
      } else {
        this.el.nativeElement.style.display = 'none !important';
      }
      this.stopped = true;
    });

    setTimeout(() => player.play(), 100);
  }
}
