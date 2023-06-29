import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Item } from '@modulos/general/modelos/item';
import { ItemService } from '@modulos/general/servicios/item.service';

@Component({
  selector: 'app-item-lista',
  templateUrl: './item-lista.component.html',
  styleUrls: ['./item-lista.component.scss']
})
export class ItemListaComponent implements OnInit {
  arrItems: Item[] = [];
  arrEncabezado: string[] = [
    "nombre",
    "referencia",
    "costo",
    "precio",
  ]

  constructor(
    private itemService: ItemService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista(): void {
    this.itemService.lista().subscribe((respuesta) => {
      this.arrItems = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

  detalle(){
    this.router.navigate(['/detalle']);
  }


}
