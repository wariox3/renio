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
  viewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { documentos } from '@comun/extra/mapeo-entidades/documentos';
import { ArchivosService } from '@comun/services/archivos/archivos.service';
import { ProcesadorArchivosService } from '@comun/services/archivos/procesador-archivos.service';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { DocumentoService } from '@comun/services/documento/documento.service';
import { GeneralService } from '@comun/services/general.service';
import { Modelo } from '@comun/type/modelo.type';
import { RegistroAutocompletarConMovimiento } from '@interfaces/comunes/autocompletar/contabilidad/con-movimiento.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { ArchivoRespuesta } from '@interfaces/comunes/lista/archivos.interface';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TamanoArchivoPipe } from '@pipe/tamano-archivo.pipe';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { TablaComponent } from '../tabla/tabla.component';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import { PaginadorComponent } from '../paginador/paginador.component';
import { TranslateModule } from '@ngx-translate/core';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { RegistroAutocompletarConGrupo } from '@interfaces/comunes/autocompletar/contabilidad/con-grupo.interface';
import { SeleccionarContactoComponent } from '../factura/components/seleccionar-contacto/seleccionar-contacto.component';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';

@Component({
  selector: 'app-comun-documento-opciones',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    TablaComponent,
    TamanoArchivoPipe,
    AnimationFadeInUpDirective,
    PaginadorComponent,
    TranslateModule,
    SeleccionarContactoComponent,
  ],
  templateUrl: './documento-opciones.component.html',
  styleUrl: './documento-opciones.component.scss',
})
export class DocumentoOpcionesComponent extends General implements OnInit {
  private readonly _modalService = inject(NgbModal);
  private readonly _generalService = inject(GeneralService);
  private readonly _descargarArchivosService = inject(DescargarArchivosService);
  private readonly _documentoService = inject(DocumentoService);
  private readonly _archivosService = inject(ArchivosService);
  private readonly _procesadorArchivosService = inject(
    ProcesadorArchivosService,
  );
  private _facturaService = inject(FacturaService);

  public arrGrupo: RegistroAutocompletarConGrupo[] = [];
  public arrDocumentos: any[];
  public arrDocumentosGrupo: { grupo: string; detalle_id: number }[] = [];
  public cantidadRegistros: number;
  public listaArchivos: ArchivoRespuesta[] = [];
  public subiendoArchivo$ = new BehaviorSubject<boolean>(false);
  public documentoId: number;
  public totalDebito = 0;
  public totalCredito = 0;

  public estadosBotonEliminar$ = new BehaviorSubject<boolean[]>([]);
  public parametrosConsulta: ParametrosFiltros = {
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 0,
    modelo: 'ConMovimiento',
    filtros: [],
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
      this.documentoId = parametro.detalle;
      this.parametrosConsulta.filtros = [
        {
          propiedad: 'documento_id',
          valor1: this.documentoId,
        },
      ];
      this.parametrosConsulta.modelo = this.opciones.modelo;
    });
  }

  private _agregarEstadoABotonesEliminar() {
    const estados = [...this.estadosBotonEliminar$.value, false];
    this.estadosBotonEliminar$.next(estados);
  }

  private _toggleEstadoBotonEliminarPorIndex(index: number) {
    const estados = [...this.estadosBotonEliminar$.value];
    if (index >= 0 && index < estados.length) {
      estados[index] = !estados[index];
      this.estadosBotonEliminar$.next(estados);
    }
  }

  private _eliminarPosicionBotonesEliminar(index: number) {
    const estados = this.estadosBotonEliminar$.value.filter(
      (_, i) => i !== index,
    );
    this.estadosBotonEliminar$.next(estados);
  }

  private _limpiarBotonesEliminar() {
    this.estadosBotonEliminar$.next([]);
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

  private _consultarArchivos() {
    this._generalService
      .consultarDatosAutoCompletar<ArchivoRespuesta>({
        modelo: 'GenArchivo',
        filtros: [
          {
            propiedad: 'documento_id',
            valor1: this.documentoId,
          },
        ],
      })
      .subscribe({
        next: (response) => {
          this._limpiarBotonesEliminar();
          this.listaArchivos = response.registros;

          this.listaArchivos.forEach(() =>
            this._agregarEstadoABotonesEliminar(),
          );

          this.changeDetectorRef.detectChanges();
        },
      });
  }

  private _submitArchivo(
    base64: string,
    nombreArchivo: string,
    documentoId: number,
  ) {
    this.subiendoArchivo$.next(true);
    this._archivosService
      .cargarArchivoGeneral({
        archivoBase64: base64,
        nombreArchivo,
        documentoId,
      })
      .pipe(
        finalize(() => {
          this.subiendoArchivo$.next(false);
        }),
      )
      .subscribe({
        next: () => {
          this._consultarArchivos();
          this.alertaService.mensajaExitoso(
            'El archivo se ha cargado exitosamente!',
          );
        },
      });
  }

  cargarArchivo(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const name = file.name;

      // Usamos el servicio para convertir el archivo a Base64
      this._procesadorArchivosService
        .convertToBase64(file)
        .then((base64) => {
          this._submitArchivo(base64, name, this.documentoId);
        })
        .catch((error) => {
          console.error('Error al procesar el archivo:', error);
        });
    }
  }

  descargarArchivo(archivo: ArchivoRespuesta) {
    this._archivosService.descargarArchivoGeneral({
      id: archivo.id,
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
    this._consultarArchivos();
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

  cambiarOrdemiento(ordenamiento: string) {
    (this.parametrosConsulta.ordenamientos[0] = ordenamiento),
      this._consultarInformacionTabla();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.parametrosConsulta.limite = data.desplazamiento;
    this.parametrosConsulta.desplazar = data.limite;
    this._consultarInformacionTabla();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this.parametrosConsulta.desplazar = desplazamiento;
    this._consultarInformacionTabla();
  }

  confirmarEliminarArchivo(id: number, index: number) {
    this.alertaService
      .confirmar({
        titulo: '¿Estas seguro de eliminar?',
        texto: 'Esta acción no se puede revertir.',
        textoBotonCofirmacion: 'Si, eliminar',
      })
      .then((respuesta) => {
        if (respuesta.isConfirmed) {
          this._eliminarArchivo(id, index);
        }
      });
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
    this._documentoService
      .contabilizar({ ids: [this.documento.id] })
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
    this._documentoService
      .descontabilizar({ ids: [this.documento.id] })
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

  private _eliminarArchivo(archivoId: number, index: number) {
    this._toggleEstadoBotonEliminarPorIndex(index);
    this._archivosService
      .eliminarArchivoGeneral({ id: archivoId })
      .pipe(
        finalize(() => {
          this._toggleEstadoBotonEliminarPorIndex(index);
        }),
      )
      .subscribe({
        next: () => {
          this._eliminarPosicionBotonesEliminar(index);
          this._consultarArchivos();
          this.alertaService.mensajaExitoso(
            'El archivo se eliminó correctamente!',
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
      .consultarDatosAutoCompletar<RegistroAutocompletarConMovimiento>(
        this.parametrosConsulta,
      )
      .subscribe((respuesta) => {
        this.cantidadRegistros = respuesta.cantidad_registros;
        this.arrDocumentos = respuesta.registros.map((documento) => ({
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
            this._abirModal(this.corregirContent);
            this.arrDocumentos = respuesta.documento.detalles;
          } else {
            this.alertaService.mensajeError(
              'Error',
              'El documento esta contabilizado y no se puede corregir',
            );
          }
        }),
        switchMap(() =>
          this._generalService.consultarDatosAutoCompletar<RegistroAutocompletarConGrupo>(
            {
              modelo: 'ConGrupo',
              serializador: 'ListaAutocompletar',
            },
          ),
        ),
        tap((respuestaAutoCompletar) => {
          this.arrGrupo = respuestaAutoCompletar.registros;
        }),
      )
      .subscribe();
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

  actualizarContactoSeleccionado(
    contacto: RegistroAutocompletarGenContacto,
    documentoId: number,
  ) {
    this._facturaService
      .actualizarDetalleGrupo(documentoId, {
        documento: this.detalle,
        contacto: contacto?.contacto_id || null,
      })
      .subscribe(() => {
        const posicion = this.arrDocumentos.findIndex(
          (documento) => documento.id === documentoId,
        );
        if (posicion >= 0 && contacto) {
          this.arrDocumentos[posicion].contacto_nombre_corto =
            contacto?.contacto_nombre_corto || '';
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
