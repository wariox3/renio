import {
  Component,
  EventEmitter,
  Input,
  Output,
  signal
} from '@angular/core';

@Component({
  selector: 'app-comun-paginador',
  standalone: true,
  imports: [],
  templateUrl: './paginador.component.html',
})
export class PaginadorComponent {
  protected _cantidadRegistros = signal(0);
  protected readonly _registrosVisiables = signal(50);
  lado = signal(0);
  al = signal(this._registrosVisiables());

  @Input() set cantidadRegistros(value: number) {
    this._cantidadRegistros.set(value); // Actualizamos la señal cuando cambie el valor
  }
  @Input() set registrosVisiables(value: number) {
    this._registrosVisiables.set(value); // Actualizamos la señal cuando cambie el valor
  }
  @Output() emitirDesplazamiento: EventEmitter<any> = new EventEmitter();
  @Output() emitirPaginacion: EventEmitter<any> = new EventEmitter();

  aumentarDesplazamiento() {
    this.lado.update((lado) => lado + this._registrosVisiables());
    this.al.update((al) => al + this._registrosVisiables());
    this.emitirDesplazamiento.emit(this.lado());
  }

  disminuirDesplazamiento() {
    if (this.lado() > 0) {
      this.lado.update((lado) => {
        let nuevoValor = lado - this._registrosVisiables();
        return nuevoValor;
      });
      this.al.update((al) => al - this._registrosVisiables());
      this.emitirDesplazamiento.emit(this.lado());
    }
  }

  calcularValorMostrar(event: Event) {
    const campoBusqueda = event.target as HTMLInputElement;
    if (campoBusqueda.value) {
      let valorInicial = campoBusqueda.value;
      if (valorInicial.includes('-')) {
        let [valorInicialLimite, valorInicialDesplazamiento] =
          valorInicial.split('-');
        let limite: number = parseInt(valorInicialLimite);
        let desplazamiento: number =
          parseInt(valorInicialDesplazamiento) - limite + 1;
        if (limite > 0) {
          limite -= 1;
          if (desplazamiento > 0 || limite > 0) {
            this.emitirPaginacion.emit({ desplazamiento, limite });
          }
        }
        if (desplazamiento < 0) {
          campoBusqueda.value = `${this.lado}-${this.al}`;
        }
      } else {
        this.emitirPaginacion.emit({
          desplazamiento: parseInt(valorInicial),
          limite: 1,
        });
      }
    } else {
      campoBusqueda.value = `${this.lado}-${this.al}`;
      this.emitirPaginacion.emit({
        desplazamiento: this.al(),
        limite: this.lado(),
      });
    }
  }

  deshabilitarBotonDerecha(){
    return this._cantidadRegistros() <= this.al();
  }

  deshabilitarBotonIzquierda() {
    return this.lado() < 1;
  }
}
