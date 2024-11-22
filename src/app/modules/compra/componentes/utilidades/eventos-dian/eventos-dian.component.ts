import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { General } from '@comun/clases/general';
import { utilidades } from '@comun/extra/mapeoEntidades/utilidades';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { HttpService } from '@comun/services/http.service';
import { TranslateModule } from '@ngx-translate/core';

import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap, zip } from 'rxjs';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { EstadosEventosDianComponent } from "../extra/estados-eventos-dian/estados-eventos-dian.component";

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
    BaseFiltroComponent,
    EstadosEventosDianComponent
],
})
export class EventosDianComponent extends General implements OnInit {
  filtroPermanenteLista = [
    { propiedad: 'documento_tipo', valor1: '5' },
    { propiedad: 'estado_aprobado', valor1: true },
  ];
  arrParametrosConsultaLista: any = {
    filtros: this.filtroPermanenteLista,
    limite: 50,
    desplazar: 0,
    ordenamientos: ['estado_aprobado', '-fecha', '-numero', '-id'],
    limite_conteo: 10000,
    modelo: 'GenDocumento',
    serializador: 'EventoCompra',
  };
  arrDocumentosEmitir: any = [];
  arrDocumentosNotificar: any = [];
  arrRegistrosSeleccionadosNotificar: number[] = [];
  arrRegistrosSeleccionadosEmitir: number[] = [];
  emitirSelectTodo = false;
  notificarSelectTodo = false;
  paginacionEmitirDesde: number = 0;
  paginacionEmitirHasta: number = this.arrParametrosConsultaLista.limite;
  cantidad_registros: number = 0;

  constructor(
    private httpService: HttpService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.modelo = parametro.itemNombre!;
      this.consultarLista();
    });
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: utilidades['eventos_dian'] })
    );
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    zip(
      this.httpService.post(
        'general/funcionalidad/lista/',
        this.arrParametrosConsultaLista
      )
    ).subscribe((respuesta: any) => {
      this.arrDocumentosEmitir = respuesta[0].registros.map(
        (documento: any) => ({
          ...documento,
          ...{
            selected: false,
          },
        })
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
                  (item) => item !== documento_id
                );
              this.consultarLista();
            }),
            catchError(() => {
              this.alertaService.mensajeError(
                'Error',
                `No al emitir documento: ${documento_id}`
              );
              return of(null);
            })
          )
          .subscribe();
      });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No tiene registros seleccionados'
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
        'No tiene registros seleccionados'
      );
    }
  }

  visualizarTap(tap: string) {
    this.store.dispatch(ActualizarMapeo({ dataMapeo: utilidades[tap] }));
    this.arrParametrosConsultaLista.filtros = this.filtroPermanenteLista;
    this.consultarLista();
  }

  obtenerFiltrosEmitir(arrFiltrosExtra: any) {
    if (arrFiltrosExtra !== null) {
      if (arrFiltrosExtra.length >= 1) {
        this.arrParametrosConsultaLista.filtros = [
          ...this.filtroPermanenteLista,
          ...arrFiltrosExtra,
        ];
      } else {
        this.arrParametrosConsultaLista.filtros = this.filtroPermanenteLista;
      }
    }
    this.consultarLista();
  }

  aumentarDesplazamientoEmitir() {
    this.paginacionEmitirDesde =
      this.paginacionEmitirDesde + this.arrParametrosConsultaLista.limite;
    this.paginacionEmitirHasta =
      this.paginacionEmitirHasta + this.arrParametrosConsultaLista.limite;
    this.arrParametrosConsultaLista.desplazar = this.paginacionEmitirDesde;
    this.consultarLista();
  }

  disminuirDesplazamientoEmitir() {
    if (this.paginacionEmitirDesde > 0) {
      let nuevoValor =
        this.paginacionEmitirDesde - this.arrParametrosConsultaLista.limite;
      this.paginacionEmitirHasta =
        this.paginacionEmitirHasta - this.arrParametrosConsultaLista.limite;
      this.paginacionEmitirDesde = nuevoValor <= 1 ? 0 : nuevoValor;
      this.arrParametrosConsultaLista.desplazar = this.paginacionEmitirDesde;
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

}
