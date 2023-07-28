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
  @Output() itemId: EventEmitter<any> = new EventEmitter();


  objectKeys(obj: any) {
   let  encabezado: any = [];
    for (const iterator in obj) {
      encabezado = Object.keys(obj[iterator]);
    }
    return encabezado;
  }

  objectEntries(obj: any) {
    console.log(obj);
    return Object.entries(obj);
  }

  detalle(item: any){
    this.itemId.emit(item)
  }

  editar(item: any){
    this.itemId.emit(item)
  }

}
