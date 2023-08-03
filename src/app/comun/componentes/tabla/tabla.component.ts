import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comun-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TablaComponent implements OnInit, OnChanges {
  @Input() encabezado: string[] = [];
  @Input() datos!: any[];
  @Input() cantidad_registros!: number;
  @Output() itemDetalle: EventEmitter<any> = new EventEmitter();
  @Output() itemEditar: EventEmitter<any> = new EventEmitter();
  @Output() cantidadRegistros: EventEmitter<any> = new EventEmitter();
  @Output() desplazar: EventEmitter<any> = new EventEmitter();
  tamanoEncabezado = 0;
  arrCantidadRegistro = [50, 100, 200];
  registrosVisiables = 50;
  lado: number = 1;
  al: number = this.registrosVisiables;

  ngOnInit() {
    this.tamanoEncabezado = this.encabezado.length;
  }

  ngOnChanges(cambios: SimpleChanges): void {
    if (
      cambios.datos &&
      cambios.datos.currentValue &&
      cambios.datos.currentValue[0]
    ) {
      if (
        Object.keys(cambios.datos.currentValue[0]).length !==
        this.tamanoEncabezado
      ) {
        cambios.datos.currentValue.map((data: any) => {
          if (Object.keys(data).length !== this.tamanoEncabezado) {
            const diferencia = this.tamanoEncabezado - Object.keys(data).length;
            for (let i = 0; i < diferencia; i++) {
              data[`nuevaPosicion${i}`] = '';
            }
          }
        });
      }
    }
  }

  objectKeys(obj: any) {
    let encabezado: any = [];
    for (const iterator in obj) {
      encabezado = Object.keys(obj[iterator]);
    }

    return encabezado;
  }

  objectEntries(obj: any) {
    return Object.entries(obj);
  }

  detalle(item: any) {
    return this.itemDetalle.emit(item);
  }

  editar(item: any) {
    return this.itemEditar.emit(item);
  }

  cambiarCantidadRegistros() {
    this.al = this.registrosVisiables;
    this.cantidadRegistros.emit(this.registrosVisiables);
  }

  aumentarDesplazamiento() {
    this.lado = this.lado + this.registrosVisiables;
  }

  disminuirDesplazamiento() {
    let nuevoValor = this.lado - this.registrosVisiables;
    this.lado = nuevoValor <= 1 ? 1 : nuevoValor;
  }

  validarCantidadMostrando() {
    if (this.lado <= 0) {
      this.lado = 1;
    }
    this.desplazar.emit(this.lado);

  }

  validarCantidadAl() {
    if (this.al > this.cantidad_registros) {
      this.al = this.cantidad_registros;
    } else if (this.al <= 0) {
      this.al = this.registrosVisiables;
    }

    this.cantidadRegistros.emit(this.al);

  }
}
