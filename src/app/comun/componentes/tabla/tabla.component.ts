import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-comun-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
  standalone: true,
  imports: [
    CommonModule
]
})
export class TablaComponent {

  @Input() encabezado: string[] = []
  @Input() datos : any[] = []
  @Output() itemDetalle: EventEmitter<any> = new EventEmitter();
  @Output() itemEditar: EventEmitter<any> = new EventEmitter();


  objectKeys(obj: any) {
   let  encabezado: any = [];
    for (const iterator in obj) {
      encabezado = Object.keys(obj[iterator]);
    }
    return encabezado;
  }

  objectEntries(obj: any) {
    return Object.entries(obj);
  }

  detalle(item: any){
    return this.itemDetalle.emit(item)
  }

  editar(item: any){
    return this.itemEditar.emit(item)
  }

}
