import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { KeysPipe } from '@pipe/keys.pipe';

@Component({
  selector: 'app-comun-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule, KeysPipe]
})
export class TablaComponent {
  tamanoEncabezado = 0;
  arrCantidadRegistro = [50, 100, 200];
  registrosVisiables = 50;
  lado: number = 0;
  al: number = this.registrosVisiables;
  ordenadoTabla: string = '';
  cargandoDatos = false;
  arrRegistrosEliminar:number[] = [];
  selectAll = false;
  @Input() encabezado:  Listafiltros[] = [];
  @Input() datos: any[]= [];
  @Input() cantidad_registros!: number;
  @Output() itemDetalle: EventEmitter<any> = new EventEmitter();
  @Output() itemEditar: EventEmitter<any> = new EventEmitter();
  @Output() cantidadRegistros: EventEmitter<any> = new EventEmitter();
  @Output() emitirDesplazamiento: EventEmitter<any> = new EventEmitter();
  @Output() emitirOrdenamiento: EventEmitter<any> = new EventEmitter();
  @Output() emitirPaginacion: EventEmitter<any> = new EventEmitter();
  @Output() emitirRegistraEliminar: EventEmitter<Number[]> = new EventEmitter();

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
    this.al = this.al + this.registrosVisiables;
    this.emitirDesplazamiento.emit(this.lado);
  }

  disminuirDesplazamiento() {
    if (this.lado > 0) {
      let nuevoValor = this.lado - this.registrosVisiables;
      this.al = this.al - this.registrosVisiables;

      this.lado = nuevoValor <= 1 ? 0 : nuevoValor;
      this.emitirDesplazamiento.emit(this.lado);
    }
  }

  validarCantidadMostrando() {
    if (this.lado < 0) {
      this.lado = 1;
    }
    this.emitirDesplazamiento.emit(this.lado);
  }

  validarCantidadAl() {
    if (this.al > this.cantidad_registros) {
      this.al = this.cantidad_registros;
    } else if (this.al <= 0) {
      this.al = this.registrosVisiables;
    }

    this.cantidadRegistros.emit(this.al);
  }

  orderPor(nombre: string, i: number) {
    if (this.ordenadoTabla.charAt(0) == '-') {
      this.ordenadoTabla = nombre.toLowerCase();
    } else {
      this.ordenadoTabla = `-${nombre.toLowerCase()}`;
    }

    this.emitirOrdenamiento.emit(this.ordenadoTabla);
  }

  calcularValorMostrar(evento: any) {
    if (evento.target.value) {
      let valorInicial = evento.target.value;
      if (valorInicial.includes('-')) {
        let [limite, desplazamiento] = valorInicial.split('-');
        desplazamiento = desplazamiento - limite + 1;
        if (limite > 0) {
          limite -= 1;
          if(desplazamiento > 0 && limite > 0){
            this.emitirPaginacion.emit({desplazamiento, limite})
          }
        }
        if (desplazamiento < 0) {
          evento.target.value = `${this.lado}-${this.al}`;
        }
      } else {
        this.emitirPaginacion.emit({desplazamiento:parseInt(valorInicial), limite:1})
      }
    } else {
      evento.target.value = `${this.lado}-${this.al}`;
      this.emitirPaginacion.emit({desplazamiento:this.al, limite:this.lado})

    }
  }

  agregarRegistrosEliminar(id: number) {
    const index = this.arrRegistrosEliminar.indexOf(id);
    if (index !== -1) {
      this.arrRegistrosEliminar.splice(index, 1);
    } else {
      this.arrRegistrosEliminar.push(id);
    }
  }

  eliminarRegistros(){
    this.emitirRegistraEliminar.emit(this.arrRegistrosEliminar)
    this.arrRegistrosEliminar = []
    this.selectAll = !this.selectAll;

  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;

    this.datos.forEach(item => {
      item.selected = this.selectAll;
      const index = this.arrRegistrosEliminar.indexOf(item.id);
      if (index !== -1) {
        this.arrRegistrosEliminar.splice(index, 1);
      } else {
        this.arrRegistrosEliminar.push(item.id);

      }
    });

  }

}
