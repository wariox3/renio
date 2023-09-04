import { Injectable } from '@angular/core';
import { HttpService } from '@comun/services/http.service';
import { Store } from '@ngrx/store';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { switchMap } from 'rxjs';
import { Item } from '@interfaces/general/item';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private httpService: HttpService, private store: Store) {}

  guardarItem(data: any) {
    return this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap(([usuarioId]) =>
          this.httpService.post<Item>('general/item/', data)
        )
      )
    }

  consultarDetalle(id: number) {
    return this.httpService.get<any>(`general/item/${id}/`);
  }

  actualizarDatosItem(id: number, data: any) {
    return this.httpService.put<any>(`general/item/${id}/`, data);
  }
}
