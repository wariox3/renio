import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  signal,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { GeneralService } from '@comun/services/general.service';
import { AplicacionAccion } from '@comun/type/aplicaciones-acciones.type';
import { RegistroAutocompletarHumConceptoAdicional } from '@interfaces/comunes/autocompletar/humano/hum-concepto-adicional.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import {
  NgbDropdownModule,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-modal-programacion-detalle-adicional',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    CommonModule,
    NgSelectModule,
  ],
  templateUrl: './modal-programacion-detalle-adicional.component.html',
  styleUrl: './modal-programacion-detalle-adicional.component.scss',
})
export class ModalProgramacionDetalleAdicionalComponent {
  accion = signal<Extract<AplicacionAccion, 'nuevo' | 'detalle'>>;
  arrConceptosAdicional = signal<RegistroAutocompletarHumConceptoAdicional[]>(
    []
  );
  arrContratos: any[] = [];
  registroAdicionalSeleccionado: number;

  formularioAdicionalProgramacion: FormGroup;
  formularioEditarDetalleProgramacion: FormGroup;
  public busquedaContrato = new Subject<string>();
  public cargandoEmpleados$ = new BehaviorSubject<boolean>(false);
  arrParametrosConsultaAdicionalEditar: ParametrosFiltros;
  adicional: any = {
    id: 0,
    valor: '',
    horas: '',
    aplica_dia_laborado: false,
    detalle: null,
    concepto: '',
    contrato: '',
  };

  @Input() programacionId: number;
  @ViewChild('contentModalAdicional') contentModalAdicional: TemplateRef<any>;

  private _modalService = inject(NgbModal);
  private _generalService = inject(GeneralService);

  abrirModal(id: number) {
    this._modalService.open(this.contentModalAdicional, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.registroAdicionalSeleccionado = id;
    this._consultarConceptosAdicionales();
    this.inicializarParametrosConsultaAdicionalDetalle(id);
    this.consultarRegistroDetalleAdicional();
  }

  private _consultarConceptosAdicionales() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumConceptoAdicional>({
        filtros: [
          {
            propiedad: 'adicional',
            valor1: true,
          },
        ],
        modelo: 'HumConcepto',
        serializador: 'ListaAutocompletar',
      })
      .subscribe((respuesta) => {
        this.arrConceptosAdicional.set(respuesta.registros);
      });
  }

  inicializarParametrosConsultaAdicionalDetalle(id: number) {
    this.arrParametrosConsultaAdicionalEditar = {
      filtros: [
        { propiedad: 'programacion_id', valor1: this.programacionId },
        {
          propiedad: 'id',
          valor1: id,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'HumAdicional',
    };
  }

  consultarRegistroDetalleAdicional() {

  }
}
