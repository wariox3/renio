import { AnimationBuilder, animate, style } from '@angular/animations';
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appAnimationFadeinLeft]',
  standalone: true,
})
export class AnimationFadeInLeftDirective implements OnInit {
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
          transform: 'translateX(-20px)',
        }),
        animate(
          `${0.5 * this.animacionDelay}s ease-in`,
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ])
      .create(this.elementRef.nativeElement);

    player.play();
  }
}
