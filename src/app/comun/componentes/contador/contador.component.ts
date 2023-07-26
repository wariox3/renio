import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, interval, map, takeWhile } from 'rxjs';

@Component({
  selector: 'app-contador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contador.component.html'
})
export class ContadorComponent implements OnChanges {
  @Input() limite: number;
  contador$: Observable<number>;
  currentCount: number;

  ngOnChanges(changes: SimpleChanges): void {
    const incremento = Math.ceil(this.limite / 1000); // Ajusta el incremento para números grandes
    this.currentCount = 0;
    this.contador$ = interval(incremento).pipe(
      takeWhile(() => this.currentCount <= this.limite),
      map(() => {
        this.currentCount += incremento;
        return this.currentCount <= this.limite ? this.currentCount : this.limite;
      })
    );

  }

}
