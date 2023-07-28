import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@modulos/general/modelos/item';

@Component({
  selector: 'app-item-lista',
  templateUrl: './item-lista.component.html',
  styleUrls: ['./item-lista.component.scss'],
})
export class ItemListaComponent extends General implements OnInit {
  arrItems: Item[] = [];
  arrEncabezado: string[] = ['nombre'];

  paises: string[] = ['País 1', 'País 2', 'País 3'];
  ciudadesPorPais: { [key: string]: string[] } = {
    'País 1': ['Ciudad 1-1', 'Ciudad 1-2', 'Ciudad 1-3'],
    'País 2': ['Ciudad 2-1', 'Ciudad 2-2', 'Ciudad 2-3'],
    'País 3': ['Ciudad 3-1', 'Ciudad 3-2', 'Ciudad 3-3']
  };

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista(): void {
    this.httpService.get<Item>('general/item/').subscribe((respuesta) => {
      this.arrItems = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

  detalle(item: Item) {
    this.router.navigate(['/general/administracion/item/detalle', 3]);
  }

  editar(item: Item) {
    this.router.navigate(['/general/administracion/item/editar', 3]);
  }

  ciudades: string[] = [];

  onPaisSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const pais = target.value;
    this.ciudades = this.ciudadesPorPais[pais];
  }
}
