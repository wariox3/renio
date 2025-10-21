import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FiltroComponent } from '@comun/componentes/ui/tabla/filtro/filtro.component';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { Modelo } from '@comun/type/modelo.type';
import { ModeloConfig } from '@interfaces/menu/configuracion.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { Subject, takeUntil } from 'rxjs';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import {
  FilterCondition,
  FilterField,
} from 'src/app/core/interfaces/filtro.interface';
import { PaginadorComponent } from '@comun/componentes/ui/tabla/paginador/paginador.component';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';

@Component({
  selector: 'app-recurrente',
  standalone: true,
  imports: [FiltroComponent, SiNoPipe, CommonModule, PaginadorComponent],
  templateUrl: './recurrente.component.html',
  styleUrls: ['./recurrente.component.scss'],
})
export default class RecurrenteComponent implements OnInit, OnDestroy {
  private readonly _generalService = inject(GeneralService);
  private readonly _httpService = inject(HttpService);
  private readonly _configModuleService = inject(ConfigModuleService);
  private readonly _filterTransformerService = inject(FilterTransformerService);

  private readonly _ngbModal = inject(NgbModal);
  private _key: null | number | Modelo | undefined;
  protected router = inject(Router);
  private _destroy$ = new Subject<void>();
  public modeloConfig: ModeloConfig | null;
  public currentPage = signal(1);
  public parametrosConsulta: ParametrosApi = {
    serializador: 'lista',
    documento_tipo_id: 32,
    ordering: 'estado_aprobado,-fecha,-numero,-id',
  };
  public facturas = signal<any>([]);
  public cantidadRegistros = signal<number>(0);
  public availableFields: FilterField[] = [];

  ngOnInit(): void {
    this._setupConfigModuleListener();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  private _setupConfigModuleListener() {
    this._configModuleService.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => {
        this._loadModuleConfiguration(value);
        this.consultarLista();
      });
  }

  private _loadModuleConfiguration(modeloConfig: ModeloConfig | null) {
    this._key = modeloConfig?.key;
    this.availableFields = [
      { name: 'id', displayName: 'ID', type: 'number' },
      {
        name: 'contacto__numero_identificacion',
        displayName: '[Contacto] Identificación',
        type: 'string',
      },
      {
        name: 'contacto__nombre_corto',
        displayName: '[Contacto] Nombre',
        type: 'string',
      },
    ];
  }

  private consultarLista() {
    this._generalService
      .consultaApi<
        RespuestaApi<any>
      >('general/documento/', this.parametrosConsulta)
      .subscribe((respuesta) => {
        this.facturas.set(respuesta.results);
        this.cantidadRegistros.set(respuesta.count);
      });
  }

  filterChange(filters: FilterCondition[]) {
    // Transformar los filtros a parámetros de API
    const apiParams =
      this._filterTransformerService.transformToApiParams(filters);

    this._generalService
      .consultaApi<
        RespuestaApi<any>
      >('general/documento/', { ...this.parametrosConsulta, ...apiParams })
      .subscribe((respuesta) => {
        this.facturas.set(respuesta.results);
        this.cantidadRegistros.set(respuesta.count);
      });
  }

  cambiarPaginacion(data: any) {
    this.parametrosConsulta = {
      ...this.parametrosConsulta,
      page: data,
    };

    this.consultarLista();
  }

  generar(id: number) {
    this._httpService
      .post<{ id: number }>('general/documento/generar/', { id })
      .subscribe({
        next: (respuesta: { id: number }) => {
          this.router.navigate([`compra/documento/detalle/${respuesta.id}`], {
            queryParams: {
              modelo: this._key,
            },
          });
          this._ngbModal.dismissAll();
        },
        error: (err) => {
          console.error('Subscriber error:', err);
          this._ngbModal.dismissAll();
        }, // This will only be called if you re-throw the error in catchError
      });
  }
}
