import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';
import { animate, style, AnimationBuilder } from '@angular/animations';

@Directive({
  selector: '[appAnimacionFadeInOut]',
  standalone: true,
})
export class AnimacionFadeInOutDirective implements OnInit {

  constructor(
    private elementRef: ElementRef,
    private animationBuilder: AnimationBuilder
  ) {}

  ngOnInit() {
    const player = this.animationBuilder
      .build([
        style({
          opacity: 0,
        }),
        animate(`${0.5}s ease-in`, style({ opacity: 1 })),
      ])
      .create(this.elementRef.nativeElement);
    player.play();
  }
}
