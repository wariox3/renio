import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import { documentos } from '@comun/extra/mapeo-entidades/documentos';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { DocumentoService } from '@comun/services/documento/documento.service';
import { GeneralService } from '@comun/services/general.service';
import { Modelo } from '@comun/type/modelo.type';
import { RegistroAutocompletarConGrupo } from '@interfaces/comunes/autocompletar/contabilidad/con-grupo.interface';
import { RegistroAutocompletarConMovimiento } from '@interfaces/comunes/autocompletar/contabilidad/con-movimiento.interface';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { RegistroAutocompletarGenSede } from '@interfaces/comunes/autocompletar/general/gen-sede.interface';
import { DocumentoFacturaRespuesta } from '@interfaces/comunes/factura/factura.interface';
import { ArchivoRespuesta } from '@interfaces/comunes/lista/archivos.interface';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { BehaviorSubject, finalize, tap, zip } from 'rxjs';
import {
  ParametrosApi,
  RespuestaApi,
} from 'src/app/core/interfaces/api.interface';
import { CargarArchivosComponent } from '../cargar-archivos/cargar-archivos.component';
import { SeleccionarContactoComponent } from '../factura/components/seleccionar-contacto/seleccionar-contacto.component';
import { TablaComponent } from '../tabla/tabla.component';
import { PaginadorComponent } from '../ui/tabla/paginador/paginador.component';

@Component({
  selector: 'app-comun-documento-opciones',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    TablaComponent,
    TranslateModule,
    SeleccionarContactoComponent,
    AnimationFadeInUpDirective,
    CargarArchivosComponent,
    NgbNavModule,
    PaginadorComponent,
  ],
  templateUrl: './documento-opciones.component.html',
  styleUrl: './documento-opciones.component.scss',
})
export class DocumentoOpcionesComponent extends General implements OnInit {
  private readonly _modalService = inject(NgbModal);
  private readonly _generalService = inject(GeneralService);
  private readonly _descargarArchivosService = inject(DescargarArchivosService);
  private readonly _documentoService = inject(DocumentoService);
  private _facturaService = inject(FacturaService);

  public arrGrupo: RegistroAutocompletarConGrupo[] = [];
  public encabezadoDocumento: DocumentoFacturaRespuesta | null = null;
  public arrDocumentos: any[];
  public arrDocumentosCorregir: any[];
  public sedes: RegistroAutocompletarGenSede[] = [];
  public arrDocumentosGrupo: { grupo: string; detalle_id: number }[] = [];
  public cantidadRegistros: number;
  public listaArchivos: ArchivoRespuesta[] = [];
  public subiendoArchivo$ = new BehaviorSubject<boolean>(false);
  public documentoId: number;
  public totalDebito = 0;
  public totalCredito = 0;
  public active: Number = 1;
  public cargandoAccion = signal<boolean>(false);
  public currentPage = signal(1);
  public totalPages = signal(1);
  public estadosBotonEliminar$ = new BehaviorSubject<boolean[]>([]);
  public parametrosConsulta: ParametrosApi = {
    limite: 51,
  };
  public cantidadRegistrosCorregir = signal(0);

  @Input() opcionesDesaprobarBoton: {
    deshabilitado: boolean;
  };
  @Input({ required: true }) opciones: {
    modelo: Modelo;
  } = {
    modelo: 'ConMovimiento',
  };
  @Input({ required: true }) documento: any;
  @Input() permiteContabilizar: boolean = true;
  @Input() permiteCorregir: boolean = true;
  @Output() itemDesaprobadoEvent: EventEmitter<void>;
  @Output() recargarDatosEvent: EventEmitter<void>;
  @ViewChild('corregirContent') corregirContent!: TemplateRef<any>;

  constructor() {
    super();
    this.itemDesaprobadoEvent = new EventEmitter();
    this.recargarDatosEvent = new EventEmitter();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.documentoId = this.detalle;
      this.parametrosConsulta = {
        documento_id: this.documentoId,
      };
    });
  }

  getEstadosBotonEliminar$() {
    return this.estadosBotonEliminar$.asObservable();
  }

  private _abirModal(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  abrirModalContabilidad(content: any) {
    this._consultarInformacionTabla();
    this._cargarDatosMapeo(this.opciones.modelo);
    this._abirModal(content);
  }

  consultarInformacionCorregir(content: any) {
    this._consultarInformacionTablaCorregir();
    this._cargarDatosMapeo(this.opciones.modelo);
  }

  abrirModalArchivos(content: any) {
    this._abirModal(content);
  }

  descargarExcel() {
    this._descargarArchivosService.descargarExcelAdminsitrador('', {
      filtros: [
        {
          propiedad: 'documento_id',
          valor1: this.documentoId,
        },
      ],
      modelo: this.opciones.modelo,
      excel: true,
      limite: 5000,
      serializador: 'Excel',
    });
  }

  onPageChange(page: number) {
    this.parametrosConsulta = {
      ...this.parametrosConsulta,
      page,
    };
    this._consultarInformacionTabla();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.parametrosConsulta = {
      ...this.parametrosConsulta,
      page: data.desplazamiento,
    };

    this._consultarInformacionTabla();
  }

  confirmarDesaprobarDocumento() {
    this.alertaService
      .confirmar({
        titulo: '¿Estas seguro de desaprobar?',
        texto: '',
        textoBotonCofirmacion: 'Si, desaprobar',
      })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          this._desaprobarDocumento(this.documentoId);
        }
      });
  }

  contabilizar() {
    this.cargandoAccion.set(true);
    this._documentoService
      .contabilizar({ ids: [this.documento.id] })
      .pipe(
        finalize(() => {
          this.cargandoAccion.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.itemDesaprobadoEvent.emit();
          this._consultarInformacionTabla();
          this.alertaService.mensajaExitoso(
            'El documento se ha contabilizado!',
          );
        },
        error: () => {
          this.itemDesaprobadoEvent.emit();
          this._consultarInformacionTabla();
        },
      });
  }

  descontabilizar() {
    this.cargandoAccion.set(true);
    this._documentoService
      .descontabilizar({ ids: [this.documento.id] })
      .pipe(
        finalize(() => {
          this.cargandoAccion.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.itemDesaprobadoEvent.emit();
          this._consultarInformacionTabla();
          this.alertaService.mensajaExitoso(
            'El documento se ha descontabilizado!',
          );
        },
      });
  }

  private _desaprobarDocumento(documentoId: number) {
    this._documentoService.desaprobarDocumento({ id: documentoId }).subscribe({
      next: () => {
        this.alertaService.mensajaExitoso('Documento desaprobado con exito!');
        this.itemDesaprobadoEvent.emit();
      },
    });
  }

  private _cargarDatosMapeo(modelo: string) {
    this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[modelo] }));
  }

  private _consultarInformacionTabla() {
    this._generalService
      .consultaApi<
        RespuestaApi<RegistroAutocompletarConMovimiento>
      >('contabilidad/movimiento/', this.parametrosConsulta)
      .subscribe((respuesta) => {
        this.cantidadRegistros = respuesta.count;
        this.arrDocumentos = respuesta.results.map((documento) => ({
          id: documento.id,
          fecha: documento.fecha,
          numero: documento.numero,
          contacto_nombre_corto: documento.contacto_nombre_corto,
          comprobante: documento.comprobante_nombre,
          cuenta: documento.cuenta_codigo,
          grupo: documento.grupo_nombre,
          base: documento.base,
          debito: documento.debito,
          credito: documento.credito,
          detalle: documento.detalle,
        }));

        this.totalDebito = this.arrDocumentos.reduce(
          (total, doc) => total + (doc.debito || 0),
          0,
        );
        this.totalCredito = this.arrDocumentos.reduce(
          (total, doc) => total + (doc.credito || 0),
          0,
        );

        this.changeDetectorRef.detectChanges();
      });
  }

  private _consultarInformacionTablaCorregir() {
    this._facturaService
      .consultarDetalle(this.detalle)
      .pipe(
        tap((respuesta: any) => {
          this.cantidadRegistrosCorregir.set(
            respuesta.documento.detalles.length,
          );
          if (!respuesta.documento.estado_contabilizado) {
            this.arrDocumentosCorregir = respuesta.documento.detalles;
            this.encabezadoDocumento = respuesta.documento;
            this._abirModal(this.corregirContent);
          } else {
            this.alertaService.mensajeError(
              'Error',
              'El documento esta contabilizado y no se puede corregir',
            );
          }
        }),
      )
      .subscribe();

    zip(
      this._generalService.consultaApi<RegistroAutocompletarConGrupo[]>(
        'contabilidad/grupo/seleccionar/',
        {
          limit: 100,
        },
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenSede[]>(
        'general/sede/seleccionar/',
        {
          limit: 100,
        },
      ),
    ).subscribe((respuesta) => {
      this.arrGrupo = respuesta[0];
      this.sedes = respuesta[1];
    });
  }

  actualizarGrupo(event: Event, id: number) {
    const grupo = (event.target as HTMLSelectElement).value;

    this._facturaService
      .actualizarDetalleGrupo(id, {
        documento: this.detalle,
        grupo,
      })
      .subscribe(() => {
        this.alertaService.mensajaExitoso('Se actualizó la información');
      });
  }

  actualizarSede(event: Event) {
    const sede = (event.target as HTMLSelectElement).value;
    this._facturaService
      .actualizarEncabezado(this.documentoId, {
        sede,
      })
      .subscribe(() => {
        this.alertaService.mensajaExitoso('Se actualizó la información');
      });
  }

  actualizarContactoSeleccionado(
    contacto: RegistroAutocompletarGenContacto,
    documentoId: number,
  ) {
    this._facturaService
      .actualizarDetalleGrupo(documentoId, {
        documento: this.detalle,
        contacto: contacto?.id || null,
      })
      .subscribe(() => {
        const posicion = this.arrDocumentosCorregir.findIndex(
          (documento) => documento.id === documentoId,
        );
        if (posicion >= 0 && contacto) {
          this.arrDocumentosCorregir[posicion].contacto_nombre_corto =
            contacto?.nombre_corto || '';
        }
        this.alertaService.mensajaExitoso('Se actualizó la información');
      });
  }

  actualizarBase(event: Event, id: number) {
    const base = (event.target as HTMLSelectElement).value;

    this._facturaService
      .actualizarDetalleGrupo(id, {
        documento: this.detalle,
        base,
      })
      .subscribe(() => {
        this.alertaService.mensajaExitoso('Se actualizó la información');
      });
  }
}
