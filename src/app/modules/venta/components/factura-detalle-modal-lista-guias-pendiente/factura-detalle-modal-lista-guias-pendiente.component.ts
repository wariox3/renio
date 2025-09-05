import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, signal, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { General } from "@comun/clases/general";
import { TablaComponent } from "@comun/componentes/tabla/tabla.component";
import { documentos } from "@comun/extra/mapeo-entidades/documentos";
import { mapeoIndependientes } from "@comun/extra/mapeo-entidades/independientes";
import { BotonesExtras } from "@interfaces/comunes/configuracion-extra/configuracion-extra.interface";
import { GuiaService } from "@modulos/transporte/servicios/guia.service";
import { DocumentoGuiaService } from "@modulos/venta/servicios/documento-guia.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarMapeo } from "@redux/actions/menu.actions";
import { catchError, forkJoin, of, Subject, switchMap, takeUntil } from "rxjs";
import { ParametrosApi } from "src/app/core/interfaces/api.interface";


@Component({
  selector: 'app-despacho-modal-lista-guias-pendiente',
  standalone: true,
  imports: [TablaComponent, CommonModule],
  templateUrl: './factura-detalle-modal-lista-guias-pendiente.component.html',
})
export class FacturaDetalleModalListaGuiasPendienteComponent extends General implements OnDestroy, OnInit {
  private readonly _modalService = inject(NgbModal);
  private _activatedRoute = inject(ActivatedRoute);
  private _guiaService = inject(GuiaService);
  private _documentoGuiaService = inject(DocumentoGuiaService);
  private destroy$ = new Subject<void>();

  public guiasSeleccionadas = signal<any[]>([]);
  public guias = signal<any[]>([]);
  public cantidadRegistros = signal<number>(0);
  public botonesExtras: BotonesExtras[] = [
    {
      componenteNombre: 'generar',
      nombreBoton: 'Guardar',
      configuracionModal: {
        size: 'sm',
        titulo: '',
      },
      emitirValorCheck: true,
    }
  ];
  public parametrosApiPermanente: ParametrosApi = {
    limit: 50,
  };
  public parametrosApi: ParametrosApi = {
    ...this.parametrosApiPermanente,
  };

  @Output() registroExitoso = new EventEmitter<boolean>(false);
  @ViewChild('content') modal!: TemplateRef<any>;
  @ViewChild(TablaComponent, { static: false }) tablaComponent!: TablaComponent;

  ngOnInit(): void {
    this.consultarLista();
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal() {
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: mapeoIndependientes['TransGuia'] })
    );
    this._modalService.open(this.modal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });
  }

  onSeleccionGuias(guias: any[]) {
    this.guiasSeleccionadas.set(guias);
  }

  consultarLista() {
    this._guiaService.lista(this.parametrosApi).subscribe(respuesta => {
      this.guias.set(respuesta.results);
      this.cantidadRegistros.set(respuesta.count);
    });
  }

  agregarGuias() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param) => {
          const documentoId = Number(param.id);
          const nuevos$ = this.guiasSeleccionadas().map(guia =>
            this._documentoGuiaService
              .adicionarGuia({
                documento_id: documentoId,
                guia_id: guia,
              })
              .pipe(
                catchError(err => {
                  console.error(`Error al agregar guia ${guia.id}:`, err);
                  this.guiasSeleccionadas.set([]);
                  return of(null); // devolvemos algo para que forkJoin no falle
                })
              )
          );

          return forkJoin(nuevos$);
        })
      )
      .subscribe({
        next: () => {
          this.guiasSeleccionadas.set([]);
          this.cerrarModal()
          this.registroExitoso.emit(true);
        },
        error: err => {
          console.error('Error al agregar guías:', err);
          this.guiasSeleccionadas.set([]);
        },
      });
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.parametrosApi = {
      ...this.parametrosApi,
      page: data.desplazamiento,
    };

    this.consultarLista();
  }

  private _actualizarTabla() {
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['documentoGuia'] })
    );
  }

  cerrarModal() {
    this._modalService.dismissAll();
    this._actualizarTabla();
  }
}
