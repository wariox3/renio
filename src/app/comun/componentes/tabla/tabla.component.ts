import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-comun-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
]
})
export class TablaComponent {

  @Input() cabeceras: any[] = [

  ]
  @Input() datos : any[] = []

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
}
