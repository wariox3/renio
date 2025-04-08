import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { utilidades } from '@comun/extra/mapeo-entidades/utilidades';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarGenDocumentoTipo } from '@interfaces/comunes/autocompletar/general/gen-documento-tipo.interface';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { PaginadorComponent } from '../../../../../comun/componentes/paginador/paginador.component';
import { ContabilizarService } from './services/contabilizar.service';
import { FechasService } from '@comun/services/fechas.service';
import { DocumentoService } from '@comun/services/documento/documento.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-factura-electronica',
  standalone: true,
  templateUrl: './contabilizar.component.html',
  styleUrl: './contabilizar.component.scss',
  imports: [
    CommonModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    BaseFiltroComponent,
    PaginadorComponent,
    ReactiveFormsModule,
  ],
})
export default class ContabilizarComponent extends General implements OnInit {
  private readonly _contabilizarService = inject(ContabilizarService);
  private readonly _modalService = inject(NgbModal);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _generalService = inject(GeneralService);
  private readonly _fechaService = inject(FechasService);
  private readonly _documentoService = inject(DocumentoService);

  public formularioDescontabilizar: FormGroup;
  public isContabilizando = signal<boolean>(false);
  public descontabilizando = signal<boolean>(false);
  public documentoTipos = signal<RegistroAutocompletarGenDocumentoTipo[]>([]);
  public contabilizarLista = this._contabilizarService.contabilizarLista;
  public cantidadRegistros = this._contabilizarService.cantidadRegistros;
  public registrosSeleccionados =
    this._contabilizarService.registrosSeleccionados;

  @ViewChild('checkboxSelectAll') checkboxAll: ElementRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.consultarLista();
    this.store.dispatch(
      ActualizarMapeo({ dataMapeo: utilidades['contabilizar'] }),
    );

    this.iniciarFormulario();
    this.getDocumentosTipos();
  }

  iniciarFormulario() {
    const fecha = this._fechaService.obtenerFechaActualFormateada();

    this.formularioDescontabilizar = this._formBuilder.group(
      {
        fecha_desde: [fecha, this, Validators.required],
        fecha_hasta: [fecha, Validators.required],
        numero_desde: [null],
        numero_hasta: [null],
        documento_tipo: [''],
      },
      {
        validator: this.fechaDesdeMenorQueFechaHasta(
          'fecha_desde',
          'fecha_hasta',
        ),
      },
    );
  }

  getDocumentosTipos() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarGenDocumentoTipo>({
        limite: 50,
        desplazar: 0,
        ordenamientos: [],
        filtros: [
          {
            propiedad: 'contabilidad',
            operador: 'exact',
            valor1: true,
          },
        ],
        limite_conteo: 10000,
        modelo: 'GenDocumentoTipo',
        serializador: 'ListaAutocompletar',
      })
      .subscribe((response) => {
        this.documentoTipos.set(response.registros);
      });
  }

  consultarLista() {
    this._contabilizarService.consultarListaContabilizar().subscribe();
  }

  enviarFormulario() {
    const filtros: ParametrosFiltros = {
      limite: 1000,
      desplazar: 0,
      ordenamientos: [],
      filtros: [
        {
          propiedad: 'fecha',
          operador: 'gte',
          valor1: this.formularioDescontabilizar.get('fecha_desde')?.value,
        },
        {
          propiedad: 'fecha_contable',
          operador: 'lte',
          valor1: this.formularioDescontabilizar.get('fecha_hasta')?.value,
        },
        {
          propiedad: 'estado_contabilizado',
          operador: 'exact',
          valor1: true,
        },
      ],
      limite_conteo: 10000,
      modelo: 'GenDocumento',
    };

    if (this.formularioDescontabilizar.get('documento_tipo')?.value) {
      filtros.filtros = [
        ...filtros.filtros,
        {
          propiedad: 'documento_tipo',
          operador: 'exact',
          valor1: this.formularioDescontabilizar.get('documento_tipo')?.value,
        },
      ];
    }

    if (this.formularioDescontabilizar.get('numero_desde')?.value) {
      filtros.filtros = [
        ...filtros.filtros,
        {
          propiedad: 'numero',
          operador: 'gte',
          valor1: this.formularioDescontabilizar.get('numero_desde')?.value,
        },
      ];
    }

    if (this.formularioDescontabilizar.get('numero_hasta')?.value) {
      filtros.filtros = [
        ...filtros.filtros,
        {
          propiedad: 'numero',
          operador: 'lte',
          valor1: this.formularioDescontabilizar.get('numero_hasta')?.value,
        },
      ];
    }

    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarGenDocumentoTipo>(
        filtros,
      )
      .subscribe((response) => {
        this._descontabilizarDocumentos(response.registros);
      });
  }

  private _descontabilizarDocumentos(documentos: any[]) {
    const documentoIds = documentos.map((documento) => {
      return documento.id;
    });

    if (documentoIds.length) {
      this.descontabilizando.set(true);
      this._documentoService
        .descontabilizar({ ids: documentoIds })
        .pipe(
          finalize(() => {
            this.descontabilizando.set(false);
            this.consultarLista();
          }),
        )
        .subscribe((response) => {
          this._modalService.dismissAll();
          this.alertaService.mensajaExitoso(
            'Documentos descontabilizados con exito!',
          );
        });
    } else {
      this.alertaService.mensajeError('Error', 'No se encontraron documentos');
    }
  }

  contabilizarTodos() {
    if (this.registrosSeleccionados().length > 0) {
      this.isContabilizando.set(true);
      this._contabilizarService
        .ejecutarContabilizarTodos()
        .pipe(
          finalize(() => {
            this.isContabilizando.set(false);
            this.checkboxAll.nativeElement.checked = false;
            this._contabilizarService.reiniciarRegistrosSeleccionados();
            this.consultarLista();
            this.changeDetectorRef.detectChanges();
          }),
        )
        .subscribe({
          next: () => {
            this.alertaService.mensajaExitoso(
              'Registros contabilizados con exito!',
            );
          },
          error: () => {
            this.changeDetectorRef.detectChanges();
          },
        });
    }
  }

  manejarCheckItem(event: any, id: number) {
    if (event.target.checked) {
      this._agregarItemAListaEliminar(id);
    } else {
      this._removerItemDeListaEliminar(id);
    }

    this.changeDetectorRef.detectChanges();
  }

  manejarCheckGlobal(event: any) {
    if (event.target.checked) {
      this._agregarTodosLosItemsAListaEliminar();
    } else {
      this._removerTodosLosItemsAListaEliminar();
    }

    this.changeDetectorRef.detectChanges();
  }

  abrirModal(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  estoyEnListaEliminar(id: number): boolean {
    return this._contabilizarService.idEstaEnLista(id);
  }

  obtenerFiltros(filtros: Filtros[]) {
    this._contabilizarService.aplicarFiltros(filtros);
    this.consultarLista();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this._contabilizarService.actualizarPaginacion(data);
    this.consultarLista();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this._contabilizarService.cambiarDesplazamiento(desplazamiento);
    this.consultarLista();
  }

  private _agregarTodosLosItemsAListaEliminar() {
    this._contabilizarService.agregarTodosARegistrosSeleccionados();
  }

  private _removerTodosLosItemsAListaEliminar() {
    this._contabilizarService.reiniciarRegistrosSeleccionados();
  }

  private _agregarItemAListaEliminar(id: number) {
    this._contabilizarService.agregarIdARegistrosSeleccionados(id);
  }

  private _removerItemDeListaEliminar(id: number) {
    this._contabilizarService.removerIdRegistrosSeleccionados(id);
  }

  fechaDesdeMenorQueFechaHasta(
    fechaDesde: string,
    fechaHasta: string,
  ): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const desde = formGroup.get(fechaDesde)?.value;
      const hasta = formGroup.get(fechaHasta)?.value;

      // Comprobar si las fechas son válidas y si "fecha_desde" es mayor que "fecha_hasta"
      if (desde && hasta && new Date(desde) > new Date(hasta)) {
        return { fechaInvalida: true };
      }
      return null;
    };
  }
}
