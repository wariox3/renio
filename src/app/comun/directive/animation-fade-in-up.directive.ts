import { AnimationBuilder, animate, style } from '@angular/animations';
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appAnimationFadeinUp]',
  standalone: true,
})
export class AnimationFadeInUpDirective implements OnInit {
  @Input() animacionDelay: number = 1;

  constructor(
    private elementRef: ElementRef,
    private animationBuilder: AnimationBuilder
  ) {}

  ngOnInit(): void {
    const player = this.animationBuilder
      .build([
        style({
          opacity: 0,
          transform: 'translateY(20px)',
        }),
        animate(
          `${0.5 * this.animacionDelay}s ease-in`,
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ])
      .create(this.elementRef.nativeElement);

    player.play();
  }
}
