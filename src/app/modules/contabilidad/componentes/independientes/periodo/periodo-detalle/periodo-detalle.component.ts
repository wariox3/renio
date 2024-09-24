import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ConPeriodo } from '@interfaces/contabilidad/contabilidad-periodo.interface';
import { PeriodoService } from '@modulos/contabilidad/servicios/periodo.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, finalize, map } from 'rxjs';

@Component({
  selector: 'app-movimiento-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ImpuestosComponent,
    CardComponent,
    BtnAtrasComponent,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './periodo-detalle.component.html',
  styleUrl: './periodo-detalle.component.scss',
})
export class PeriodoDetalleComponent extends General implements OnInit {
  private formBuilder = inject(FormBuilder);

  public formularioPeriodo: FormGroup;
  public creandoPeriodo$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  periodos: ConPeriodo[];
  fechas: number[];
  periodosFiltradosPorAnio: ConPeriodo[] = [];
  anioSeleccionado: number;

  constructor(
    private periodoService: PeriodoService,
    private modalService: NgbModal
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
      .pipe(finalize(() => this.creandoPeriodo$.next(false)))
      .subscribe(() => {
        this.modalService.dismissAll();
        this.alertaService.mensajaExitoso('Periodo creado exitosamente!');
        this.consultarDetalle();
      });
  }

  seleccionarAnio(anio: number) {
    this.anioSeleccionado = anio;
    this.periodosFiltradosPorAnio = this.periodos
      .filter((item) => item.anio === anio)
      .sort((a, b) => b.mes - a.mes);
    this.changeDetectorRef.detectChanges();
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

  consultarDetalle() {
    this.periodoService
      .consultarDetalle()
      .pipe(map((respuesta) => respuesta.sort((a, b) => b.anio - a.anio)))
      .subscribe((respuesta) => {
        this.periodos = respuesta;
        this.fechas = [...new Set(respuesta.map((item) => item.anio))];
        this.changeDetectorRef.detectChanges();
      });
  }
}
