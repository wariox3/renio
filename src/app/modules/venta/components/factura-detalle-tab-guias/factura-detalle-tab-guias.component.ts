import { CommonModule } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnChanges, OnDestroy, OnInit, Output, signal, SimpleChanges, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { General } from "@comun/clases/general";
import { TablaComponent } from "@comun/componentes/tabla/tabla.component";
import { documentos } from '@comun/extra/mapeo-entidades/documentos';
import { BotonesExtras } from "@interfaces/comunes/configuracion-extra/configuracion-extra.interface";
import { DocumentoGuiaService } from "@modulos/venta/servicios/documento-guia.service";
import { FacturaService } from "@modulos/venta/servicios/factura.service";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActualizarMapeo } from "@redux/actions/menu.actions";
import { catchError, forkJoin, of, Subject, switchMap, takeUntil } from "rxjs";
import { ParametrosApi } from "../../../../core/interfaces/api.interface";
import { FacturaDetalleModalListaGuiasPendienteComponent } from "../factura-detalle-modal-lista-guias-pendiente/factura-detalle-modal-lista-guias-pendiente.component";
import { FacturaModalAgregarGuiaComponent } from "../factura-modal-agregar-guia/factura-modal-agregar-guia.component";

@Component({
  selector: 'app-factura-detalle-tab-guias',
  standalone: true,
  imports: [TablaComponent, CommonModule, FacturaModalAgregarGuiaComponent, FacturaDetalleModalListaGuiasPendienteComponent],
  templateUrl: './factura-detalle-tab-guias.component.html',
})
export class FacturaDetalleTabGuiasComponent extends General implements OnDestroy, OnChanges, OnInit {
  private readonly _modalService = inject(NgbModal);
  private _activatedRoute = inject(ActivatedRoute);
  private _documentoGuiaService = inject(DocumentoGuiaService);
  private _facturaService = inject(FacturaService);
  private destroy$ = new Subject<void>();

  public guiasSeleccionadas = signal<any[]>([]);
  public guias = signal<any[]>([]);
  public cantidadRegistros = signal<number>(0);
  public botonesExtras: BotonesExtras[] = [
    {
      componenteNombre: 'generar',
      nombreBoton: 'Pendientes',
      configuracionModal: {
        size: 'sm',
        titulo: '',
      },
      emitirValorCheck: true,
    },
    {
      componenteNombre: 'generar',
      nombreBoton: 'Agregar',
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
  @Input() documento: any;
  @Output() registroExitoso = new EventEmitter<boolean>(false);
  @ViewChild('content') modal!: TemplateRef<any>;
  @ViewChild(TablaComponent, { static: false }) tablaComponent!: TablaComponent;
  @ViewChild(FacturaModalAgregarGuiaComponent, { static: false }) FacturaModalAgregarGuiaComponent!: FacturaModalAgregarGuiaComponent;
  @ViewChild(FacturaDetalleModalListaGuiasPendienteComponent, { static: false }) FacturaDetalleModalListaGuiasPendienteComponent!: FacturaDetalleModalListaGuiasPendienteComponent;

  ngOnInit(): void {
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: documentos['documentoGuia'] })
    );
    this.consultarLista();
    if (this.documento?.estado_aprobado) {
      this.botonesExtras = []
    }
    this.changeDetectorRef.detectChanges();
  }

 ngOnChanges(changes: SimpleChanges): void {
    if (changes['documento'] && this.documento) {
      if (this.documento.estado_aprobado) {
        this.botonesExtras = [];
      } else {
        // Restaurar botones si se desaprueba
        this.botonesExtras = [
          {
            componenteNombre: 'generar',
            nombreBoton: 'Pendientes',
            configuracionModal: { size: 'sm', titulo: '' },
            emitirValorCheck: true,
          },
          {
            componenteNombre: 'generar',
            nombreBoton: 'Agregar',
            configuracionModal: { size: 'sm', titulo: '' },
            emitirValorCheck: true,
          }
        ];
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal() {
    this._modalService.open(this.modal, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  onSeleccionGuias(guias: any[]) {
    this.guiasSeleccionadas.set(guias);
    this.eliminarGuias()
  }

  consultarLista() {
    this._facturaService.consultarGuias({ documento_id: this.detalle }).subscribe((respuesta: any) => {
      this.guias.set(respuesta.results);
      this.cantidadRegistros.set(respuesta.count);
      this.changeDetectorRef.detectChanges();
    });
  }

  eliminarGuias() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param) => {
          const guias$ = this.guiasSeleccionadas().map(guia =>
            this._documentoGuiaService
              .eliminar(guia)
              .pipe(
                catchError(err => {
                  console.error(`Error al eliminar guia ${guia.id}:`, err);
                  this.guiasSeleccionadas.set([]);
                  return of(null); // devolvemos algo para que forkJoin no falle
                })
              )
          );

          return forkJoin(guias$);
        })
      )
      .subscribe({
        next: () => {
          this.guiasSeleccionadas.set([]);
          this.consultarLista();
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

  abrirModal(datosBoton: BotonesExtras) {
    if (datosBoton.nombreBoton === 'Pendientes') {
      this.FacturaDetalleModalListaGuiasPendienteComponent.openModal();
    }
    if (datosBoton.nombreBoton === 'Agregar') {
      this.FacturaModalAgregarGuiaComponent.openModal();
    }
  }
}
