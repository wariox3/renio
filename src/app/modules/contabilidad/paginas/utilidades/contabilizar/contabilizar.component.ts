import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { utilidades } from '@comun/extra/mapeo-entidades/utilidades';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { ContabilizarService } from './services/contabilizar.service';
import { PaginadorComponent } from '../../../../../comun/componentes/paginador/paginador.component';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';

@Component({
  selector: 'app-factura-electronica',
  standalone: true,
  templateUrl: './contabilizar.component.html',
  imports: [
    CommonModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    BaseFiltroComponent,
    PaginadorComponent,
  ],
})
export default class ContabilizarComponent extends General implements OnInit {
  private readonly _contabilizarService = inject(ContabilizarService);

  public contabilizarLista = this._contabilizarService.contabilizarLista;
  public cantidadRegistros = this._contabilizarService.cantidadRegistros;
  public registrosSeleccionados =
    this._contabilizarService.registrosSeleccionados;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();

    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.modelo = parametro.itemNombre!;
    });

    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: utilidades['contabilizar'] })
    );
  }

  consultarLista() {
    this._contabilizarService.consultarListaContabilizar().subscribe();
  }

  contabilizarTodos() {
    if (this.registrosSeleccionados().length > 0) {
      this._contabilizarService.ejecutarContabilizarTodos().subscribe({
        next: () => {
          this.consultarLista();
          this.alertaService.mensajaExitoso(
            'Registros contabilizados con exito!'
          );
        },
        error: () => {
          this._contabilizarService.reiniciarRegistrosSeleccionados();
          this.changeDetectorRef.detectChanges();
        },
      });
    }
  }

  manejarCheckItem(event: any, id: number) {
    if (event.target.checked) {
      this._agregarItemAListaEliminar(id);
    } else {
      this._removerItemDeListaEliminar(id);
    }

    this.changeDetectorRef.detectChanges();
  }

  manejarCheckGlobal(event: any) {
    if (event.target.checked) {
      this._agregarTodosLosItemsAListaEliminar();
    } else {
      this._removerTodosLosItemsAListaEliminar();
    }

    this.changeDetectorRef.detectChanges();
  }

  estoyEnListaEliminar(id: number): boolean {
    return this._contabilizarService.idEstaEnLista(id);
  }

  obtenerFiltros(filtros: Filtros[]) {
    this._contabilizarService.aplicarFiltros(filtros);
    this.consultarLista();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this._contabilizarService.actualizarPaginacion(data);
    this.consultarLista();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this._contabilizarService.cambiarDesplazamiento(desplazamiento);
    this.consultarLista();
  }

  private _agregarTodosLosItemsAListaEliminar() {
    this._contabilizarService.agregarTodosARegistrosSeleccionados();
  }

  private _removerTodosLosItemsAListaEliminar() {
    this._contabilizarService.reiniciarRegistrosSeleccionados();
  }

  private _agregarItemAListaEliminar(id: number) {
    this._contabilizarService.agregarIdARegistrosSeleccionados(id);
  }

  private _removerItemDeListaEliminar(id: number) {
    this._contabilizarService.removerIdRegistrosSeleccionados(id);
  }
}
