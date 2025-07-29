import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImportarXmlComponent } from '@comun/componentes/importar-xml/importar-xml.component';
import { utilidades } from '@comun/extra/mapeo-entidades/utilidades';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { EVENTOS_DIAN_FILTERS } from '@modulos/compra/domain/mapeos/eventos_dian.mapeo';
import { EventosDianService } from '@modulos/compra/servicios/eventos-dian.service';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { catchError, of, tap } from 'rxjs';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { FiltroComponent } from '../../../../../comun/componentes/ui/tabla/filtro/filtro.component';
import { PaginadorComponent } from '../../../../../comun/componentes/ui/tabla/paginador/paginador.component';
import { EditarEventosDianComponent } from '../extra/editar-eventos-dian/editar-eventos-dian.component';
import { GestionEstadosEventosDianComponent } from '../extra/gestion-estados-eventos-dian/gestion-estados-eventos-dian.component';
import { VisualizarEstadosEventosDianComponent } from '../extra/visualizar-estados-eventos-dian/visualizar-estados-eventos-dian.component';

@Component({
  selector: 'app-documento-electronico',
  standalone: true,
  templateUrl: './eventos-dian.component.html',
  imports: [
    CommonModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    VisualizarEstadosEventosDianComponent,
    GestionEstadosEventosDianComponent,
    EditarEventosDianComponent,
    ImportarXmlComponent,
    NgbTooltipModule,
    SiNoPipe,
    PaginadorComponent,
    FiltroComponent,
  ],
})
export class EventosDianComponent extends General implements OnInit {
  filtroPermanenteLista: ParametrosApi = {
    documento_tipo_id: '5',
    estado_aprobado: true,
    estado_electronico_evento: false,
    estado_electronico_descartado: false,
    estado_anulado: false,
    ordering: 'estado_aprobado -fecha -numero -id',
    limit: 50,
    serializador: 'evento_compra',
  };
  arrParametrosConsultaLista: ParametrosApi = this.filtroPermanenteLista;
  arrDocumentosEmitir: any = [];
  arrDocumentosNotificar: any = [];
  arrRegistrosSeleccionadosNotificar: number[] = [];
  arrRegistrosSeleccionadosEmitir: number[] = [];
  emitirSelectTodo = false;
  notificarSelectTodo = false;
  paginacionEmitirDesde: number = 0;
  paginacionEmitirHasta: number = this.arrParametrosConsultaLista
    .limit as number;
  cantidad_registros: number = 0;
  private _generalService = inject(GeneralService);
  private _filterTransformerService = inject(FilterTransformerService);
  currentPage = signal(1);
  totalPages = signal(1);
  availableFields = EVENTOS_DIAN_FILTERS;
  constructor(
    private httpService: HttpService,
    private eventosDianService: EventosDianService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.consultarLista();
    });
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: utilidades['eventos_dian'] }),
    );
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this._generalService
      .consultaApi('general/documento/', this.arrParametrosConsultaLista)
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
    // this.arrParametrosConsultaLista.filtros = this.filtroPermanenteLista;
    // this.consultarLista();
  }

  obtenerFiltrosEmitir(filters: FilterCondition[]) {
    const apiParams =
      this._filterTransformerService.transformToApiParams(filters);

    if (Object.keys(filters).length >= 1) {
      this.arrParametrosConsultaLista = {
        ...this.arrParametrosConsultaLista,
        ...apiParams,
      };
    } else {
      this.arrParametrosConsultaLista = this.filtroPermanenteLista;
    }

    this.consultarLista();
  }

  aumentarDesplazamientoEmitir() {
    // this.paginacionEmitirDesde =
    //   this.paginacionEmitirDesde + this.arrParametrosConsultaLista.limite;
    // this.paginacionEmitirHasta =
    //   this.paginacionEmitirHasta + this.arrParametrosConsultaLista.limite;
    // this.arrParametrosConsultaLista.desplazar = this.paginacionEmitirDesde;
    // this.consultarLista();
  }

  disminuirDesplazamientoEmitir() {
    // if (this.paginacionEmitirDesde > 0) {
    //   let nuevoValor =
    //     this.paginacionEmitirDesde - this.arrParametrosConsultaLista.limite;
    //   this.paginacionEmitirHasta =
    //     this.paginacionEmitirHasta - this.arrParametrosConsultaLista.limite;
    //   this.paginacionEmitirDesde = nuevoValor <= 1 ? 0 : nuevoValor;
    //   this.arrParametrosConsultaLista.desplazar = this.paginacionEmitirDesde;
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
            this.arrParametrosConsultaLista.desplazar = desplazamiento;
            this.arrParametrosConsultaLista.limite = parseInt(limite);
            this.consultarLista();
          }
        }
        if (desplazamiento < 0) {
          evento.target.value = `${this.paginacionEmitirDesde}-${this.paginacionEmitirHasta}`;
        }
      } else {
        this.arrParametrosConsultaLista.desplazar = parseInt(valorInicial);
        this.arrParametrosConsultaLista.limite = 1;
        this.consultarLista();
      }
    } else {
      evento.target.value = `${this.paginacionEmitirDesde}-${this.paginacionEmitirHasta}`;
      this.arrParametrosConsultaLista.desplazar = this.paginacionEmitirHasta;
      this.arrParametrosConsultaLista.limite = this.paginacionEmitirDesde;
      this.consultarLista();
    }
  }

  confirmarDescartar(id: number) {
    this.alertaService
      .confirmar({
        titulo: '¿Estas seguro de descartar?',
        texto: 'Esta acción no se puede revertir.',
        textoBotonCofirmacion: 'Si, descartar',
      })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          this._descartar(id);
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.arrParametrosConsultaLista = {
      ...this.arrParametrosConsultaLista,
      page,
    };
    this.consultarLista();
  }

  private _descartar(id: number) {
    this.eventosDianService.descartar(id).subscribe(() => {
      this.consultarLista();
    });
  }
}
