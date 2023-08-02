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

@Component({
  selector: 'app-comun-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TablaComponent implements OnInit, OnChanges {
  @Input() encabezado: string[] = [];
  @Input() datos!: any[];
  @Output() itemDetalle: EventEmitter<any> = new EventEmitter();
  @Output() itemEditar: EventEmitter<any> = new EventEmitter();
  @Output() cantidadRegistros: EventEmitter<any> = new EventEmitter();
  tamanoEncabezado = 0;
  arrCantidadRegistro = [50,100, 200]
  cantidadSeleccionada = 50

  ngOnInit() {
    this.tamanoEncabezado = this.encabezado.length;
  }

  ngOnChanges(cambios: SimpleChanges): void {
    if (cambios.datos && cambios.datos.currentValue && cambios.datos.currentValue[0]) {
      if (Object.keys(cambios.datos.currentValue[0]).length !== this.tamanoEncabezado) {
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

  cambiarCantidadRegistros(cantidad: any){
    this.cantidadSeleccionada = cantidad.target.value
    this.cantidadRegistros.emit(cantidad.target.value)
  }
}
