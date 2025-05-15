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
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { TranslateModule } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BaseFiltroComponent } from '../../../../../comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '../../../../../comun/componentes/card/card.component';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { utilidades } from '@comun/extra/mapeo-entidades/utilidades';

@Component({
  selector: 'app-enviar-nomina-electronica',
  standalone: true,
  imports: [CardComponent, BaseFiltroComponent, TranslateModule, CommonModule],
  templateUrl: './enviar-nomina-electronica.component.html',
  styleUrl: './enviar-nomina-electronica.component.css',
})
export class EnviarNominaElectronicaComponent
  extends General
  implements OnInit
{
  private _generalService = inject(GeneralService);
  private _httpService = inject(HttpService);

  documentos = signal<any[]>([]);
  itemsSeleccionados = signal<number[]>([]);
  paginacionEmitirDesde: number = 1;
  paginacionEmitirHasta: number = 50;
  checkboxSelectAll: any;
  emitirSelectTodo: string = 'emitirSelectTodo';
  cantidadDocumentos = signal<number>(0);

  filtroPermanenteEmitir: Filtros[] = [
    {
      propiedad: 'estado_aprobado',
      valor1: true,
    },
    {
      propiedad: 'estado_electronico',
      valor1: false,
    },
    {
      propiedad: 'estado_electronico_descartado',
      valor1: false,
    },
    {
      propiedad: 'documento_tipo__documento_clase__grupo',
      valor1: 7,
    },
  ];
  arrParametrosConsultaEmitir: ParametrosFiltros = {
    filtros: this.filtroPermanenteEmitir,
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: 'GenDocumento',
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
      .consultarDatosLista(this.arrParametrosConsultaEmitir)
      .subscribe((respuesta: any) => {
        this.cantidadDocumentos.set(respuesta.registros.length);
        this.documentos.set(respuesta.registros);
      });
  }

  obtenerFiltrosEmitir(arrFiltrosExtra: any) {
    if (arrFiltrosExtra !== null) {
      if (arrFiltrosExtra.length >= 1) {
        this.arrParametrosConsultaEmitir.filtros = [
          ...this.filtroPermanenteEmitir,
          ...arrFiltrosExtra,
        ];
      } else {
        this.arrParametrosConsultaEmitir.filtros = this.filtroPermanenteEmitir;
      }
    }
    this.consultarLista();
  }

  aumentarDesplazamientoEmitir() {
    this.paginacionEmitirDesde =
      this.paginacionEmitirDesde + this.arrParametrosConsultaEmitir.limite;
    this.paginacionEmitirHasta =
      this.paginacionEmitirHasta + this.arrParametrosConsultaEmitir.limite;
    this.arrParametrosConsultaEmitir.desplazar = this.paginacionEmitirDesde;
    this.consultarLista();
  }

  disminuirDesplazamientoEmitir() {
    if (this.paginacionEmitirDesde > 0) {
      let nuevoValor =
        this.paginacionEmitirDesde - this.arrParametrosConsultaEmitir.limite;
      this.paginacionEmitirHasta =
        this.paginacionEmitirHasta - this.arrParametrosConsultaEmitir.limite;
      this.paginacionEmitirDesde = nuevoValor <= 1 ? 0 : nuevoValor;
      this.arrParametrosConsultaEmitir.desplazar = this.paginacionEmitirDesde;
      this.consultarLista();
    }
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
      return this._httpService.post('general/documento/descartar/', {
        id: registroId,
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
    console.log(this.itemsSeleccionados());
  }

  manejarCheckGlobal(event: any) {
    if (event.target.checked) {
      this.seleccionarTodos();
    } else {
      this.limpiarSeleccionados();
    }

    this.changeDetectorRef.detectChanges();
    console.log(this.itemsSeleccionados());
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
