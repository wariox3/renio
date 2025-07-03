import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { utilidades } from '@comun/extra/mapeo-entidades/utilidades';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { FacturaElectronicaService } from '@modulos/venta/servicios/factura-electronica.service';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { finalize, forkJoin, tap, zip } from 'rxjs';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import { FiltroComponent } from '../../../../../comun/componentes/ui/tabla/filtro/filtro.component';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { PaginadorComponent } from '../../../../../comun/componentes/ui/tabla/paginador/paginador.component';
import { ENVIAR_FACTURA_ELECTRONICA_EMITIR_FILTERS, ENVIAR_FACTURA_ELECTRONICA_NOTIFICAR_FILTERS } from '@modulos/venta/domain/mapeos/enviar-factura-electronica.mapeo';

@Component({
  selector: 'app-factura-electronica',
  standalone: true,
  templateUrl: './factura-electronica.component.html',
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
export class FacturaElectronicaComponent extends General implements OnInit {
  public ENVIAR_FACTURA_ELECTRONICA_EMITIR_FILTERS = ENVIAR_FACTURA_ELECTRONICA_EMITIR_FILTERS;
  public ENVIAR_FACTURA_ELECTRONICA_NOTIFICAR_FILTERS = ENVIAR_FACTURA_ELECTRONICA_NOTIFICAR_FILTERS;

  public filtroPermanenteEmitir: ParametrosApi = {
    estado_aprobado: 'True',
    estado_electronico: 'False',
    estado_electronico_descartado: 'False',
    documento_tipo__documento_clase__grupo: 1,
    limit: 50,
  };

  public filtroPermanenteNotificar: ParametrosApi = {
    estado_electronico_notificado: 'False',
    estado_electronico: 'True',
    documento_tipo__documento_clase__grupo: 1,
    limit: 50,
  };

  arrParametrosConsultaEmitir: ParametrosApi = {
    estado_aprobado: 'True',
    estado_electronico: 'False',
    estado_electronico_descartado: 'False',
    documento_tipo__documento_clase__grupo: 1,
    limit: 50,
  };

  arrParametrosConsultaNotificar: ParametrosApi = {
    estado_electronico_notificado: 'False',
    estado_electronico: 'True',
    documento_tipo__documento_clase__grupo: 1,
    limit: 50,
  };

  arrDocumentosEmitir: any = [];
  arrDocumentosNotificar: any = [];
  arrRegistrosSeleccionadosNotificar: number[] = [];
  arrRegistrosSeleccionadosEmitir: number[] = [];
  emitirSelectTodo = false;
  notificarSelectTodo = false;
  tabActive: number = 1;
  paginacionEmitirDesde: number = 0;
  paginacionEmitirHasta: number | string | boolean =
    this.arrParametrosConsultaEmitir.limit;
  paginacionNotificarDesde: number = 0;
  paginacionNotificarHasta: number | string | boolean =
    this.arrParametrosConsultaNotificar.limit;

  totalDocumentosEmitir = signal(0);
  totalDocumentosNotificar = signal(0);
  currentPageEmitir = signal(1);
  currentPageNotificar = signal(1);

  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  private readonly _filterTransformerService = inject(FilterTransformerService);
  private readonly _generalService = inject(GeneralService);
  private readonly _facturaElectronicaService = inject(
    FacturaElectronicaService,
  );

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.consultarListaEmitir();
    });
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: utilidades['factura_electronica_emitir'] }),
    );
    this.changeDetectorRef.detectChanges();
  }

  consultarListaEmitir() {
    this._limpiarSeleccionados();
    this._generalService.consultaApi<RespuestaApi<any[]>>(
      'general/documento/',
      this.arrParametrosConsultaEmitir,
    ).subscribe((respuesta) => {
      this.totalDocumentosEmitir.set(respuesta.count);
      this.arrDocumentosEmitir = respuesta?.results?.map(
        (documento: any) => ({
          ...documento,
          ...{
            selected: false,
          },
        }),
      );
      this.changeDetectorRef.detectChanges();
    });
  }

  consultarListaNotificar() {
    this._limpiarSeleccionados();
    this._generalService.consultaApi<RespuestaApi<any[]>>(
      'general/documento/',
      this.arrParametrosConsultaNotificar,
    ).subscribe((respuesta) => {
      this.totalDocumentosNotificar.set(respuesta.count);
      this.arrDocumentosNotificar = respuesta?.results?.map(
        (documento: any) => ({
          ...documento,
          ...{
            selected: false,
          },
        }),
      );
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
              this.consultarListaEmitir();
            }),
            tap(() => {
              this.emitirSelectTodo = false;
            }),
          )
          .subscribe();
      });
    } else {
      this.emitirSelectTodo = false;
      this.changeDetectorRef.detectChanges();
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
          .pipe(
            tap(() => {
              this.arrRegistrosSeleccionadosNotificar =
                this.arrRegistrosSeleccionadosNotificar.filter(
                  (item) => item !== documento_id,
                );
              this.consultarListaNotificar();
            }),
            tap(() => {
              this.notificarSelectTodo = false;
            }),
          )
          .subscribe();
      });
      this.arrRegistrosSeleccionadosNotificar = [];
    } else {
      this.notificarSelectTodo = false;
      this.changeDetectorRef.detectChanges();
      this.alertaService.mensajeError(
        'Error',
        'No tiene registros seleccionados',
      );
    }
  }

  visualizarTap(tap: string) {
    this.store.dispatch(ActualizarMapeo({ dataMapeo: utilidades[tap] }));
    
    if(tap === 'factura_electronica_emitir') {
      this.arrParametrosConsultaEmitir = this.filtroPermanenteEmitir;
      this.consultarListaEmitir();
    } else {
      this.arrParametrosConsultaNotificar = this.filtroPermanenteNotificar;
      this.consultarListaNotificar();
    }
  }

  private _limpiarSeleccionados() {
    this.arrRegistrosSeleccionadosEmitir = [];
    this.arrRegistrosSeleccionadosNotificar = [];
  }

  obtenerFiltrosEmitir(filtros: FilterCondition[]) {
    const apiParams =
      this._filterTransformerService.transformToApiParams(filtros);

    if (filtros.length >= 1) {
      this.arrParametrosConsultaEmitir = {
        ...this.filtroPermanenteEmitir,
        ...apiParams,
      };
    } else {
      this.arrParametrosConsultaEmitir = this.filtroPermanenteEmitir;
    }

    this.consultarListaEmitir();
  }

  obtenerFiltrosNotificar(filtros: FilterCondition[]) {
    const apiParams =
      this._filterTransformerService.transformToApiParams(filtros);

    if (filtros.length >= 1) {
      this.arrParametrosConsultaNotificar = {
        ...this.filtroPermanenteNotificar,
        ...apiParams,
      };
    } else {
      this.arrParametrosConsultaNotificar = this.filtroPermanenteNotificar;
    }

    this.consultarListaNotificar();
  }

  onPageChangeEmitir(page: number): void {
    this.currentPageEmitir.set(page);

    this.arrParametrosConsultaEmitir = {
      ...this.arrParametrosConsultaEmitir,
      page,
    };

    this.consultarListaEmitir();
  }

  onPageChangeNotificar(page: number): void {
    this.currentPageNotificar.set(page);

    this.arrParametrosConsultaNotificar = {
      ...this.arrParametrosConsultaNotificar,
      page,
    };

    this.consultarListaNotificar();
  }

  confirmarDescartar() {
    this.alertaService
      .confirmar({
        titulo: '¿Estas seguro de descartar?',
        texto:
          'Esta acción no se puede revertir. Si descarta un documento, ya no podrá ser enviado electrónicamente en otro momento.',
        textoBotonCofirmacion: 'Si, descartar',
      })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          this._descartar();
        }
      });
  }

  private _descartar() {
    const solicitudes = this.arrRegistrosSeleccionadosEmitir.map(
      (registroId) => {
        return this._facturaElectronicaService.descartarFacturas({
          id: registroId,
        });
      },
    );

    forkJoin(solicitudes)
      .pipe(
        finalize(() => {
          this.checkboxAll.nativeElement.checked = false;
          this.emitirSelectTodo = false;
          this.consultarListaEmitir();
        }),
      )
      .subscribe({
        next: () => {
          this.alertaService.mensajaExitoso('Se han descartado correctamente ');
        },
      });
  }
}
