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
import { utilidades } from '@comun/extra/mapeo-entidades/utilidades';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { ENVIAR_NOMINA_ELECTRONICA_FILTERS } from '@modulos/humano/domain/mapeo/enviar-nomina-electronica.mapeo';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import { FilterCondition } from 'src/app/core/interfaces/filtro.interface';
import { FilterTransformerService } from 'src/app/core/services/filter-transformer.service';
import { CardComponent } from '../../../../../comun/componentes/card/card.component';
import { FiltroComponent } from '../../../../../comun/componentes/ui/tabla/filtro/filtro.component';
import { PaginadorComponent } from "../../../../../comun/componentes/ui/tabla/paginador/paginador.component";

@Component({
  selector: 'app-enviar-nomina-electronica',
  standalone: true,
  imports: [CardComponent, TranslateModule, CommonModule, FiltroComponent, PaginadorComponent],
  templateUrl: './enviar-nomina-electronica.component.html',
  styleUrl: './enviar-nomina-electronica.component.css',
})
export class EnviarNominaElectronicaComponent
  extends General
  implements OnInit
{
  private _generalService = inject(GeneralService);
  private _httpService = inject(HttpService);
  private _filterTransformerService = inject(FilterTransformerService);

  documentos = signal<any[]>([]);
  currentPage = signal(1);
  totalPages = signal(1);
  itemsSeleccionados = signal<number[]>([]);
  paginacionEmitirDesde: number = 1;
  paginacionEmitirHasta: number = 50;
  checkboxSelectAll: any;
  emitirSelectTodo: string = 'emitirSelectTodo';
  cantidadDocumentos = signal<number>(0);
  ENVIAR_NOMINA_ELECTRONICA_FILTERS = ENVIAR_NOMINA_ELECTRONICA_FILTERS;

  filtroPermanenteEmitir: ParametrosApi = {
    estado_aprobado: 'True',
    estado_electronico: 'False',
    estado_electronico_descartado: 'False',
    documento_tipo_id: 15,
    limit: 50,
  };

  arrParametrosConsultaEmitir: ParametrosApi = {
    ...this.filtroPermanenteEmitir,
  };

  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: utilidades['nomina_electronica'] }),
    );
  }

  consultarLista() {
    this._generalService
      .consultaApi<
        RespuestaApi<any[]>
      >('general/documento/', this.arrParametrosConsultaEmitir)
      .subscribe((respuesta) => {
        this.cantidadDocumentos.set(respuesta.count);
        this.documentos.set(respuesta.results);
      });
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);

    this.arrParametrosConsultaEmitir = {
      ...this.arrParametrosConsultaEmitir,
      page,
    };

    this.consultarLista();
  }

  filterChange(filtros: FilterCondition[]) {
    const parametros =
      this._filterTransformerService.transformToApiParams(filtros);

    if (filtros.length >= 1) {
      this.arrParametrosConsultaEmitir = {
        ...this.arrParametrosConsultaEmitir,
        ...parametros,
      };
    } else {
      this.arrParametrosConsultaEmitir = this.filtroPermanenteEmitir;
    }

    this.consultarLista();
  }

  emitir() {
    if (this.itemsSeleccionados().length >= 1) {
      const solicitudes = this.itemsSeleccionados().map((documento_id) => {
        return this._httpService.post('general/documento/emitir/', {
          documento_id,
        });
      });

      forkJoin(solicitudes)
        .pipe(
          finalize(() => {
            this.checkboxAll.nativeElement.checked = false;
            this.limpiarSeleccionados();
            this.consultarLista();
          }),
        )
        .subscribe({
          next: () => {
            this.alertaService.mensajaExitoso('Se han emitido correctamente');
          },
        });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No tiene registros seleccionados',
      );
    }
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
    const solicitudes = this.itemsSeleccionados().map((registroId) => {
      return this._httpService.post(
        'general/documento/electronico_descartar/',
        {
          id: registroId,
        },
      );
    });

    forkJoin(solicitudes)
      .pipe(
        finalize(() => {
          this.checkboxAll.nativeElement.checked = false;
          this.limpiarSeleccionados();
          this.consultarLista();
        }),
      )
      .subscribe({
        next: () => {
          this.alertaService.mensajaExitoso('Se han descartado correctamente');
        },
      });
  }

  manejarCheckItem(event: any, id: number) {
    if (event.target.checked) {
      this.seleccionar(id);
    } else {
      this.eliminarSeleccionado(id);
    }

    this.changeDetectorRef.detectChanges();
  }

  manejarCheckGlobal(event: any) {
    if (event.target.checked) {
      this.seleccionarTodos();
    } else {
      this.limpiarSeleccionados();
    }

    this.changeDetectorRef.detectChanges();
  }

  seleccionar(id: number) {
    this.itemsSeleccionados.update((items) => [...items, id]);
  }

  eliminarSeleccionado(id: number) {
    this.itemsSeleccionados.update((items) =>
      items.filter((item) => item !== id),
    );
  }

  seleccionarTodos() {
    this.documentos().forEach((item: any) => {
      const indexItem = this.itemsSeleccionados().indexOf(item.id);

      if (indexItem === -1) {
        this.itemsSeleccionados.update((items) => [...items, item.id]);
      }
    });
  }

  limpiarSeleccionados() {
    this.itemsSeleccionados.set([]);
  }

  estoySeleccionado(id: number): boolean {
    return this.itemsSeleccionados().includes(id);
  }
}
