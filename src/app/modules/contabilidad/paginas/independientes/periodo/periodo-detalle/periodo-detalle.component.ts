import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ConPeriodo } from '@modulos/contabilidad/interfaces/contabilidad-periodo.interface';
import { PeriodoService } from '@modulos/contabilidad/servicios/periodo.service';
import {
  NgbAccordionModule,
  NgbDropdownModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  finalize,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { PeriodoInconsistenciasComponent } from '../periodo-inconsistencias/periodo-inconsistencias.component';

@Component({
  selector: 'app-movimiento-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    NgbAccordionModule,
    AsyncPipe,
    NgbDropdownModule,
    PeriodoInconsistenciasComponent,
  ],
  templateUrl: './periodo-detalle.component.html',
  styleUrl: './periodo-detalle.component.scss',
})
export class PeriodoDetalleComponent
  extends General
  implements OnInit, OnDestroy
{
  private formBuilder = inject(FormBuilder);
  private _destroy$ = new Subject<void>();

  public formularioPeriodo: FormGroup;
  public periodoSeleccionado: ConPeriodo;
  public creandoPeriodo$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  periodos$: Observable<ConPeriodo[]>;
  fechas: number[];
  periodosFiltradosPorAnio$: Observable<ConPeriodo[]>;
  anioSeleccionado: number;

  constructor(
    private periodoService: PeriodoService,
    private modalService: NgbModal,
  ) {
    super();
    this.inicializarFormulario();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  inicializarFormulario() {
    const anioActual = new Date().getFullYear();
    this.formularioPeriodo = this.formBuilder.group({
      anio: [anioActual, Validators.required],
    });
  }

  crearPeriodo() {
    this.creandoPeriodo$.next(true);
    this.periodoService
      .crearPeriodo(this.formularioPeriodo.value)
      .pipe(
        takeUntil(this._destroy$),
        finalize(() => this.creandoPeriodo$.next(false)),
      )
      .subscribe(() => {
        this.modalService.dismissAll();
        this.alertaService.mensajaExitoso('Periodo creado exitosamente!');
        this.consultarDetalle();
      });
  }

  seleccionarAnio(anio: number) {
    this.anioSeleccionado = anio;
    this.periodosFiltradosPorAnio$ = this.periodos$.pipe(
      map((respuesta) => {
        return respuesta
          .filter((item) => item.anio === anio)
          .sort((a, b) => b.mes - a.mes);
      }),
    );
  }

  abrirModalCrearNuevo(content: any) {
    this.modalService.open(content);
  }

  deNumeroAMes(mes: number) {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
      'Cierre',
    ];

    return meses[mes - 1] || '';
  }

  bloquear(id: number) {
    this.periodoService.bloquear(id).subscribe((respuesta) => {
      this.alertaService.mensajaExitoso(respuesta.mensaje);
      this.consultarDetalle();
      this.changeDetectorRef.detectChanges();
    });
  }

  desbloquear(id: number) {
    this.periodoService.desbloquear(id).subscribe((respuesta) => {
      this.alertaService.mensajaExitoso(respuesta.mensaje);
      this.consultarDetalle();
      this.changeDetectorRef.detectChanges();
    });
  }

  cerrar(id: number) {
    this.periodoService.cerrar(id).subscribe((respuesta) => {
      this.alertaService.mensajaExitoso(respuesta.mensaje);
      this.consultarDetalle();
      this.changeDetectorRef.detectChanges();
    });
  }

  consultarDetalle() {
    this.periodoService
      .consultarDetalle()
      .pipe(
        takeUntil(this._destroy$),
        map((respuesta) => respuesta.sort((a, b) => b.anio - a.anio)),
      )
      .subscribe((respuesta) => {
        this.periodos$ = of(respuesta);
        this.seleccionarAnio(this.anioSeleccionado);
        this.fechas = [...new Set(respuesta.map((item) => item.anio))];
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  abrirModalInconsistencias(content: any, periodo: ConPeriodo) {
    this.periodoSeleccionado = periodo;
    this._abirModal(content);
  }

  private _abirModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }
}
