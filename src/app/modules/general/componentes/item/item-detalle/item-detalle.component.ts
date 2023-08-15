import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@modulos/general/modelos/item';

@Component({
  selector: 'app-item-detalle',
  templateUrl: './item-detalle.component.html',
  styleUrls: ['./item-detalle.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
  ]
})
export default class ItemDetalleComponent extends General implements OnInit {

  item:Item
  constructor(private httpService: HttpService) {
    super();
  }
  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.consultarDetalle();
  }

  consultarDetalle(){
    this.httpService.getDetalle<Item>('general/item/5').subscribe((respuesta)=>{
      this.item = respuesta
      this.changeDetectorRef.detectChanges();
    })
  }
}
