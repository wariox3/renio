import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { utilidades } from '@comun/extra/mapeo-entidades/utilidades';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { catchError, of, tap } from 'rxjs';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { DOCUMENTO_ELECTRONICO_FILTERS } from '@modulos/compra/domain/mapeos/documento-electronico.mapeo';
import { FiltroComponent } from '@comun/componentes/ui/tabla/filtro/filtro.component';
import { PaginadorComponent } from '../../../../../comun/componentes/ui/tabla/paginador/paginador.component';

@Component({
  selector: 'app-documento-electronico',
  standalone: true,
  templateUrl: './documento-electronico.component.html',
  imports: [
    CommonModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    FiltroComponent,
    PaginadorComponent,
  ],
})
export class DocumentoElectronicoComponent extends General implements OnInit {
  filtroPermanenteEmitir: ParametrosApi = {
    estado_aprobado: 'True',
    estado_electronico: 'False',
    estado_electronico_descartado: 'False',
    documento_tipo__electronico: 'True',
    documento_tipo__documento_clase__grupo: 3,
    limit: 50,
  };

  arrParametrosConsultaEmitir: ParametrosApi = this.filtroPermanenteEmitir;
  arrDocumentosEmitir: any = [];
  arrDocumentosNotificar: any = [];
  arrRegistrosSeleccionadosNotificar: number[] = [];
  arrRegistrosSeleccionadosEmitir: number[] = [];
  emitirSelectTodo = false;
  notificarSelectTodo = false;
  tabActive = 1;
  paginacionEmitirDesde: number = 0;
  paginacionEmitirHasta: number = this.arrParametrosConsultaEmitir
    .limit as number;
  cantidad_registros: number = 0;
  availableFields = DOCUMENTO_ELECTRONICO_FILTERS;
  private readonly _generalService = inject(GeneralService);
  private _filterTransformerService = inject(FilterTransformerService);
  currentPage = signal(1);
  totalPages = signal(1);

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.consultarLista();
    });
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: utilidades['factura_electronica_emitir'] }),
    );
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this._generalService
      .consultaApi('general/documento/', this.arrParametrosConsultaEmitir)
      .subscribe((respuesta: any) => {
        this.cantidad_registros = respuesta.count;
        this.arrDocumentosEmitir = respuesta.results.map((documento: any) => ({
          ...documento,
          ...{
            selected: false,
          },
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.arrParametrosConsultaEmitir;
    this.arrParametrosConsultaEmitir = {
      ...this.filtroPermanenteEmitir,
      page,
    };
    this.consultarLista();
  }

  agregarRegistrosNotificar(id: number) {
    // Busca el índice del registro en el array de registros a eliminar
    const index = this.arrRegistrosSeleccionadosNotificar.indexOf(id);
    // Si el registro ya está en el array, lo elimina
    if (index !== -1) {
      this.arrRegistrosSeleccionadosNotificar.splice(index, 1);
    } else {
      // Si el registro no está en el array, lo agrega
      this.arrRegistrosSeleccionadosNotificar.push(id);
    }
  }

  agregarRegistrosEmitir(id: number) {
    // Busca el índice del registro en el array de registros a eliminar
    const index = this.arrRegistrosSeleccionadosEmitir.indexOf(id);
    // Si el registro ya está en el array, lo elimina
    if (index !== -1) {
      this.arrRegistrosSeleccionadosEmitir.splice(index, 1);
    } else {
      // Si el registro no está en el array, lo agrega
      this.arrRegistrosSeleccionadosEmitir.push(id);
    }
  }

  emitirToggleSelectAll() {
    this.arrDocumentosEmitir.forEach((item: any) => {
      if (item.estado_electronico_enviado === false) {
        item.selected = !item.selected;
        const index = this.arrRegistrosSeleccionadosEmitir.indexOf(item.id);
        if (index !== -1) {
          this.arrRegistrosSeleccionadosEmitir.splice(index, 1);
        } else {
          this.arrRegistrosSeleccionadosEmitir.push(item.id);
        }
      }
    });
    this.emitirSelectTodo = !this.emitirSelectTodo;
    this.changeDetectorRef.detectChanges();
  }

  notificarToggleSelectAll() {
    this.arrDocumentosNotificar.forEach((item: any) => {
      item.selected = !item.selected;
      const index = this.arrRegistrosSeleccionadosNotificar.indexOf(item.id);
      if (index !== -1) {
        this.arrRegistrosSeleccionadosNotificar.splice(index, 1);
      } else {
        this.arrRegistrosSeleccionadosNotificar.push(item.id);
      }
    });
    this.notificarSelectTodo = !this.notificarSelectTodo;
    this.changeDetectorRef.detectChanges();
  }

  emitir() {
    if (this.arrRegistrosSeleccionadosEmitir.length >= 1) {
      this.arrRegistrosSeleccionadosEmitir.map((documento_id) => {
        this.httpService
          .post('general/documento/emitir/', { documento_id })
          .pipe(
            tap(() => {
              this.arrRegistrosSeleccionadosEmitir =
                this.arrRegistrosSeleccionadosEmitir.filter(
                  (item) => item !== documento_id,
                );
              this.consultarLista();
            }),
            catchError(() => {
              this.alertaService.mensajeError(
                'Error',
                `No al emitir documento: ${documento_id}`,
              );
              return of(null);
            }),
          )
          .subscribe();
      });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No tiene registros seleccionados',
      );
    }
  }

  notificar() {
    if (this.arrRegistrosSeleccionadosNotificar.length >= 1) {
      this.arrRegistrosSeleccionadosNotificar.map((documento_id) => {
        this.httpService
          .post('general/documento/notificar/', { documento_id })
          .subscribe((respuesta: any) => {
            this.consultarLista();
          });
      });
      this.arrRegistrosSeleccionadosNotificar = [];
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No tiene registros seleccionados',
      );
    }
  }

  visualizarTap(tap: string) {
    // this.store.dispatch(ActualizarMapeo({ dataMapeo: utilidades[tap] }));
    // this.arrParametrosConsultaEmitir.filtros = this.filtroPermanenteEmitir;
    // this.consultarLista();
  }

  obtenerFiltrosEmitir(filters: FilterCondition[]) {
    const apiParams =
      this._filterTransformerService.transformToApiParams(filters);
    this.arrParametrosConsultaEmitir = {
      ...this.filtroPermanenteEmitir,
      ...apiParams,
    };
    this.consultarLista();
  }

  aumentarDesplazamientoEmitir() {
    // this.paginacionEmitirDesde =
    //   this.paginacionEmitirDesde + this.arrParametrosConsultaEmitir.limite;
    // this.paginacionEmitirHasta =
    //   this.paginacionEmitirHasta + this.arrParametrosConsultaEmitir.limite;
    // this.arrParametrosConsultaEmitir.desplazar = this.paginacionEmitirDesde;
    // this.consultarLista();
  }

  disminuirDesplazamientoEmitir() {
    // if (this.paginacionEmitirDesde > 0) {
    //   let nuevoValor =
    //     this.paginacionEmitirDesde - this.arrParametrosConsultaEmitir.limite;
    //   this.paginacionEmitirHasta =
    //     this.paginacionEmitirHasta - this.arrParametrosConsultaEmitir.limite;
    //   this.paginacionEmitirDesde = nuevoValor <= 1 ? 0 : nuevoValor;
    //   this.arrParametrosConsultaEmitir.desplazar = this.paginacionEmitirDesde;
    //   this.consultarLista();
    // }
  }

  calcularValorMostrarEmitir(evento: any) {
    if (evento.target.value) {
      let valorInicial = evento.target.value;
      if (valorInicial.includes('-')) {
        let [limite, desplazamiento] = valorInicial.split('-');
        desplazamiento = desplazamiento - limite + 1;
        if (limite > 0) {
          limite -= 1;
          if (desplazamiento > 0) {
            this.arrParametrosConsultaEmitir.desplazar = desplazamiento;
            this.arrParametrosConsultaEmitir.limite = parseInt(limite);
            this.consultarLista();
          }
        }
        if (desplazamiento < 0) {
          evento.target.value = `${this.paginacionEmitirDesde}-${this.paginacionEmitirHasta}`;
        }
      } else {
        this.arrParametrosConsultaEmitir.desplazar = parseInt(valorInicial);
        this.arrParametrosConsultaEmitir.limite = 1;
        this.consultarLista();
      }
    } else {
      evento.target.value = `${this.paginacionEmitirDesde}-${this.paginacionEmitirHasta}`;
      this.arrParametrosConsultaEmitir.desplazar = this.paginacionEmitirHasta;
      this.arrParametrosConsultaEmitir.limite = this.paginacionEmitirDesde;
      this.consultarLista();
    }
  }
}
