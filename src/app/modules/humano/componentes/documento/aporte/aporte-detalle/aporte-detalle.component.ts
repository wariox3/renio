import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, Pipe } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImportarAdministradorComponent } from '@comun/componentes/importar-administrador/importar-administrador.component';
import { AnimacionFadeInOutDirective } from '@comun/Directive/AnimacionFadeInOut.directive';
import { DescargarArchivosService } from '@comun/services/descargarArchivos.service';
import { HttpService } from '@comun/services/http.service';
import { TablaRegistroLista } from '@interfaces/humano/programacion';
import { AporteContratoService } from '@modulos/humano/servicios/aporte-contrato.service';
import { AporteService } from '@modulos/humano/servicios/aporte.service';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, of, switchMap, tap } from 'rxjs';
import { KeeniconComponent } from 'src/app/_metronic/shared/keenicon/keenicon.component';
import { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-aporte-detalle',
  standalone: true,
  imports: [
    KeeniconComponent,
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    NgbDropdownModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    AnimacionFadeInOutDirective,
    BaseEstadosComponent,
    ImportarAdministradorComponent,
    NgSelectModule,
    TranslateModule,
  ],
  templateUrl: './aporte-detalle.component.html',
  styleUrl: './aporte-detalle.component.scss',
})
export default class AporteDetalleComponent extends General implements OnInit {
  active: Number;
  aporte: any = {
    id: null,
    sucursal: 0,
    anio: 0,
    mes: 0,
    estado_aprobado: false,
    estado_generado: false,
    sucursal_nombre: '',
  };
  arrAporteDetalle: any = [];
  generando: boolean = false;
  desgenerando: boolean = false;
  cargandoContratos: boolean = false;
  registrosAEliminar: number[] = [];
  isCheckedSeleccionarTodos: boolean = false;
  ordenadoTabla: string = '';
  arrParametrosConsulta: any;
  registroSeleccionado: number;
  registroAdicionalSeleccionado: number;
  formularioAporteContrato: FormGroup;
  arrParametrosConsultaDetalle: any;

  // Nos permite manipular el dropdown desde el codigo
  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;

  constructor(
    private aporteService: AporteService,
    private aporteContratoService: AporteContratoService,
    private httpService: HttpService,
    private descargarArchivosService: DescargarArchivosService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {
    this.inicializarParametrosConsulta();
    this.consultarDatos();
  }

  inicializarParametrosConsulta() {
    this.arrParametrosConsulta = {
      filtros: [
        {
          operador: '',
          propiedad: 'aporte_id',
          valor1: this.detalle,
          valor2: '',
        },
      ],
      limite: 1000,
      desplazar: 0,
      ordenamientos: ['contrato_id'],
      limite_conteo: 10000,
      modelo: 'HumAporteContrato',
    };
    this.changeDetectorRef.detectChanges();
  }

  consultarDetalle() {
    this.aporteService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.aporte = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  imprimir() {
    this.httpService.descargarArchivo('general/documento/imprimir/', {
      filtros: [],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: '',
      tipo: '',
      documento_tipo_id: 1,
      documento_id: this.detalle,
    });
  }

  navegarEditar(id: number) {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.router.navigate([`/documento/editar`], {
        queryParams: {
          ...parametro,
          detalle: id,
        },
      });
    });
  }

  generar() {
    //this.reiniciarSelectoresEliminar();
    this.alertaService
      .confirmarSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            return this.aporteService.generar({
              id: this.aporte.id,
            });
          }
          return of(false);
        }),
        tap((respuesta) => {
          if (respuesta !== false) {
            this.consultarDatos();
          }
        }),
        finalize(() => {
          this.generando = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  desgenerar() {
    this.desgenerando = true;
    this.aporteService
      .desgenerar({
        id: this.aporte.id,
      })
      .pipe(
        finalize(() => {
          this.desgenerando = false;
          //this.reiniciarSelectoresEliminar();
          //this.dropdown.close();
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe(() => {
        this.consultarDatos();
      });
  }

  aprobar() {
    this.alertaService
      .confirmarSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            return this.httpService.post('humano/programacion/aprobar/', {
              id: this.detalle,
            });
          }
          return of(false);
        }),
        tap((respuesta) => {
          if (respuesta !== false) {
            this.alertaService.mensajaExitoso('Documento aprobado');
            this.aporte.estado_aprobado = true;
            this.consultarDatos();
            this.changeDetectorRef.detectChanges();
          }
        })
      )
      .subscribe();
  }

  consultarDatos() {
    //this.reiniciarSelectoresEliminar();
    this.aporteService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.aporte = respuesta;
        this.httpService
          .post('general/funcionalidad/lista/', this.arrParametrosConsulta)
          .subscribe((respuesta: any) => {
            this.arrAporteDetalle = respuesta.registros.map(
              (registro: TablaRegistroLista) => ({
                ...registro,
                selected: false,
              })
            );

            this.changeDetectorRef.detectChanges();
          });
      });
  }

  descargarExcelDetalle() {
    const modelo = 'HumAporteContrato';
    const params = {
      modelo,
      serializador: 'Excel',
      excel: true,
      filtros: [{ propiedad: 'aporte_id', valor1: this.aporte.id }],
      limite: 10000,
    };

    this.descargarArchivosService.descargarExcelAdminsitrador(modelo, params);
    this.dropdown.close();
    this.changeDetectorRef.detectChanges();
  }

  cargarContratos() {
    this.cargandoContratos = true;
    this.aporteService
      .cargarContratos({
        id: this.aporte.id,
      })
      .pipe(
        finalize(() => {
          this.cargandoContratos = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe(() => {
        this.consultarDatos();
        this.changeDetectorRef.detectChanges();
      });
  }

  eliminarRegistros() {
    if (this.registrosAEliminar.length > 0) {
      this.registrosAEliminar.forEach((id) => {
        this.aporteService
          .eliminarRegistro(id, {})
          .pipe(
            finalize(() => {
              this.isCheckedSeleccionarTodos = false;
            })
          )
          .subscribe(() => {
            this.alertaService.mensajaExitoso('Registro eliminado');
            this.consultarDatos();
          });
      });
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No se han seleccionado registros para eliminar'
      );
    }

    this.registrosAEliminar = [];

    this.changeDetectorRef.detectChanges();
  }

  orderPor(nombre: string, i: number) {
    if (this.ordenadoTabla.charAt(0) == '-') {
      this.ordenadoTabla = nombre.toLowerCase();
    } else {
      this.ordenadoTabla = `-${nombre.toLowerCase()}`;
    }
    this.arrParametrosConsulta.ordenamientos[i] = this.ordenadoTabla;
    this.consultarDatos();
    this.changeDetectorRef.detectChanges();
  }

  toggleSelectAll(event: Event) {
    const seleccionarTodos = event.target as HTMLInputElement;
    this.isCheckedSeleccionarTodos = !this.isCheckedSeleccionarTodos;
    // Itera sobre todos los datos
    if (seleccionarTodos.checked) {
      this.arrAporteDetalle.forEach((item: TablaRegistroLista) => {
        // Establece el estado de selección de cada registro
        item.selected = !item.selected;
        // Busca el índice del registro en el array de registros a eliminar
        const index = this.registrosAEliminar.indexOf(item.id);
        // Si el registro ya estaba en el array de registros a eliminar, lo elimina
        if (index === -1) {
          this.registrosAEliminar.push(item.id);
        } // Si el registro no estaba en el array de registros a eliminar, lo agrega
      });
    } else {
      this.arrAporteDetalle.forEach((item: TablaRegistroLista) => {
        // Establece el estado de selección de cada registro
        item.selected = !item.selected;
      });

      this.registrosAEliminar = [];
    }

    this.changeDetectorRef.detectChanges();
  }

  // funcionalidades de eliminar registros
  agregarRegistrosEliminar(id: number) {
    // Busca el índice del registro en el array de registros a eliminar
    const index = this.registrosAEliminar.indexOf(id);
    // Si el registro ya está en el array, lo elimina
    if (index !== -1) {
      this.registrosAEliminar.splice(index, 1);
    } else {
      // Si el registro no está en el array, lo agrega
      this.registrosAEliminar.push(id);
    }
  }
}
