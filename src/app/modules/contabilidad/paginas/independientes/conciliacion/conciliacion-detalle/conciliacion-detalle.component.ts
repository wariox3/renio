import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { GeneralService } from '@comun/services/general.service';
import {
  NgbDropdown,
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import {
  BehaviorSubject,
  Subject
} from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { ConciliacionTablaSoporteComponent } from "../conciliacion-tabla-soporte/conciliacion-tabla-soporte";
import { ConciliacionTablaDetalleComponent } from "../conciliacion-tabla-detalle/conciliacion-tabla-detalle";
import { ConciliacionService } from '@modulos/contabilidad/servicios/conciliacion.service';
import { Conciliacion } from '@modulos/contabilidad/interfaces/conciliacion.interface';


@Component({
  selector: 'app-conciliacion-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    NgbDropdownModule,
    NgbNavModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgSelectModule,
    BaseEstadosComponent,
    TituloAccionComponent,
    ConciliacionTablaSoporteComponent,
    ConciliacionTablaDetalleComponent
],
  templateUrl: './conciliacion-detalle.component.html',
  styleUrl: './conciliacion-detalle.component.scss',
})
export default class ConciliacionDetalleComponent
  extends General
  implements OnInit, OnDestroy
{
  private _conciliacionService = inject(ConciliacionService);
  private _unsubscribe$ = new Subject<void>();

  public generando: boolean = false;
  public desgenerando: boolean = false;
  public notificando: boolean = false;
  public active: Number;
  public programacion: any = {
    id: 0,
    fecha_desde: '',
    fecha_hasta: '',
    cuenta_banco_id: 0,
  };

  public conciliacion = signal<Conciliacion | null>(null);
  public registroSeleccionado: number;
  public registrosAEliminar: number[] = [];
  public isCheckedSeleccionarTodos: boolean = false;
  public cargandoContratos: boolean = false;
  public visualizarBtnGuardarNominaProgramacionDetalleResumen = signal(false);
  public cantidadRegistrosProgramacionDetalle = 0;
  public cargandoEmpleados$ = new BehaviorSubject<boolean>(false);
  public busquedaContrato = new Subject<string>();

  // Nos permite manipular el dropdown desde el codigo
  @ViewChild('OpcionesDropdown', { static: true }) dropdown!: NgbDropdown;

  constructor() {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this._conciliacionService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.conciliacion.set(respuesta);
      });
  }

  navegarEditar(id: number) {
  }

  generar() {
    
  }

  aprobar() {
    
  }

  desgenerar() {
    
  }

  notificar() {
    
  }

  abrirModal() {
    
  }

  imprimirNominas() {
    
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    localStorage.removeItem('documento_programacion');
  }
}
