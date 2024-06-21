import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '../../../../../comun/componentes/tabla/tabla.component';
import { General } from '@comun/clases/general';
import { documentos } from '@comun/extra/mapeoEntidades/documentos';
import { utilidades } from '@comun/extra/mapeoEntidades/utilidades';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { HttpService } from '@comun/services/http.service';
import { TranslateModule } from '@ngx-translate/core';

import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { catchError, of, tap, zip } from 'rxjs';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';

@Component({
  selector: 'app-factura-electronica',
  standalone: true,
  templateUrl: './factura-electronica.component.html',
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    BaseFiltroComponent,
  ],
})
export class FacturaElectronicaComponent extends General implements OnInit {
  filtroPermanenteEmitir = [
    {
      propiedad: 'estado_aprobado',
      valor1: true,
    },
    {
      propiedad: 'estado_electronico',
      valor1: false,
    },
    {
      propiedad: 'documento_tipo__documento_clase__grupo',
      valor1: 1,
    },
  ];
  filtroPermanenteNotificar = [
    {
      propiedad: 'estado_electronico_notificado',
      valor1: false,
    },
    {
      propiedad: 'estado_electronico',
      valor1: true,
    },
    {
      propiedad: 'documento_tipo__documento_clase__grupo',
      valor1: 1,
    },
  ];
  arrParametrosConsultaEmitir: any = {
    filtros: this.filtroPermanenteEmitir,
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
  };
  arrParametrosConsultaNotificar: any = {
    filtros: this.filtroPermanenteNotificar,
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
  };
  arrDocumentosEmitir: any = [];
  arrDocumentosNotificar: any = [];
  arrRegistrosSeleccionadosNotificar: number[] = [];
  arrRegistrosSeleccionadosEmitir: number[] = [];
  emitirSelectTodo = false;
  notificarSelectTodo = false;
  tabActive = 1;
  paginacionEmitirDesde: number = 0;
  paginacionEmitirHasta: number = this.arrParametrosConsultaEmitir.limite;
  paginacionNotificarDesde: number = 0;
  paginacionNotificarHasta: number = this.arrParametrosConsultaNotificar.limite;
  cantidad_registros: number = 0;

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.modelo = localStorage.getItem('itemNombre')!;
      let posicion: keyof typeof documentos = parseInt(
        parametro.documento_clase
      );
      this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[posicion] }));
      this.consultarLista();
    });
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: utilidades['factura_electronica_emitir'] })
    );
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    zip(
      this.httpService.post(
        'general/documento/lista/',
        this.arrParametrosConsultaEmitir
      ),
      this.httpService.post(
        'general/documento/lista/',
        this.arrParametrosConsultaNotificar
      )
    ).subscribe((respuesta: any) => {
      this.arrDocumentosEmitir = respuesta[0].map((documento: any) => ({
        ...documento,
        ...{
          selected: false,
        },
      }));
      this.arrDocumentosNotificar = respuesta[1].map((documento: any) => ({
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
                  (item) => item !== documento_id
                );
              this.consultarLista();
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
    this.arrParametrosConsultaEmitir.filtros = this.filtroPermanenteEmitir;
    this.arrParametrosConsultaNotificar.filtros =
      this.filtroPermanenteNotificar;
    this.consultarLista();
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

  obtenerFiltrosNotificar(arrFiltrosExtra: any) {
    if (arrFiltrosExtra !== null) {
      if (arrFiltrosExtra.length >= 1) {
        this.arrParametrosConsultaNotificar.filtros = [
          ...this.filtroPermanenteNotificar,
          ...arrFiltrosExtra,
        ];
      } else {
        this.arrParametrosConsultaNotificar.filtros =
          this.filtroPermanenteNotificar;
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

  aumentarDesplazamientoNotificar() {
    this.paginacionNotificarDesde =
      this.paginacionNotificarDesde +
      this.arrParametrosConsultaNotificar.limite;
    this.paginacionNotificarHasta =
      this.paginacionNotificarHasta +
      this.arrParametrosConsultaNotificar.limite;
    this.arrParametrosConsultaNotificar.desplazar =
      this.paginacionNotificarDesde;
    this.consultarLista();
  }

  disminuirDesplazamientoNotificar() {
    if (this.paginacionNotificarDesde > 0) {
      let nuevoValor =
        this.paginacionNotificarDesde -
        this.arrParametrosConsultaNotificar.limite;
      this.paginacionNotificarHasta =
        this.paginacionNotificarHasta -
        this.arrParametrosConsultaNotificar.limite;
      this.paginacionNotificarDesde = nuevoValor <= 1 ? 0 : nuevoValor;
      this.arrParametrosConsultaNotificar.desplazar =
        this.paginacionNotificarDesde;
      this.consultarLista();
    }
  }

  calcularValorMostrarNotificar(evento: any) {
    if (evento.target.value) {
      let valorInicial = evento.target.value;
      if (valorInicial.includes('-')) {
        let [limite, desplazamiento] = valorInicial.split('-');
        desplazamiento = desplazamiento - limite + 1;
        if (limite > 0) {
          limite -= 1;
          if (desplazamiento > 0) {
            this.arrParametrosConsultaNotificar.desplazar = desplazamiento;
            this.arrParametrosConsultaNotificar.limite = limite;
            this.consultarLista();
          }
        }
        if (desplazamiento < 0) {
          evento.target.value = `${this.paginacionNotificarDesde}-${this.paginacionNotificarHasta}`;
        }
      } else {
        this.arrParametrosConsultaNotificar.desplazar = parseInt(valorInicial);
        this.arrParametrosConsultaNotificar.limite = 1;
        this.consultarLista();
      }
    } else {
      evento.target.value = `${this.paginacionNotificarDesde}-${this.paginacionNotificarHasta}`;
      this.arrParametrosConsultaNotificar.desplazar =
        this.paginacionNotificarHasta;
      this.arrParametrosConsultaNotificar.limite =
        this.paginacionNotificarDesde;
      this.consultarLista();
    }
  }
}
