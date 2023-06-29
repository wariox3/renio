import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@modulos/general/modelos/item';

@Component({
  selector: 'app-item-lista',
  templateUrl: './item-lista.component.html',
  styleUrls: ['./item-lista.component.scss'],
})
export class ItemListaComponent implements OnInit {
  arrItems: Item[] = [];
  arrEncabezado: string[] = ['nombre'];

  constructor(
    private httpService: HttpService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista(): void {
    this.httpService.get<Item>('general/item/').subscribe((respuesta) => {
      this.arrItems = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

  detalle() {
    this.router.navigate(['/detalle']);
  }
}
