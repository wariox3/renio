import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { GeneralService } from '@comun/services/general.service';
import {
  ImpuestoFormulario,
  ImpuestoRespuestaConsulta,
} from '@interfaces/comunes/factura/factura.interface';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { AdapterService } from '../../services/adapter.service';
import { RegistroAutocompletarGenImpuesto } from '@interfaces/comunes/autocompletar/general/gen-impuesto.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';

@Component({
  selector: 'app-seleccionar-impuestos',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbDropdownModule,
    SoloNumerosDirective,
  ],
  templateUrl: './seleccionar-impuestos.component.html',
  styleUrls: ['./seleccionar-impuestos.component.scss'],
})
export class SeleccionarImpuestosComponent
  extends General
  implements OnChanges
{
  private _adapterService = inject(AdapterService);
  private _generalService = inject(GeneralService);
  public impuestos: ImpuestoRespuestaConsulta[] = [];
  public listaDeImpuestosSeleccionables$: Observable<
    RegistroAutocompletarGenImpuesto[]
  > = new Observable();

  arrImpuestoSeleccionados: any[] = [];
  arrImpuestoLista: any[];
  arrParametrosConsulta: ParametrosFiltros = {
    filtros: [],
    limite: 10,
    limite_conteo: 10000,
    desplazar: 0,
    ordenamientos: ['impuesto_tipo_id', 'id'],
    modelo: 'GenImpuesto',
    serializador: 'ListaAutocompletar',
  };
  @Input() arrLista: any[];
  @Input() formularioTipo: 'venta' | 'compra' = 'venta';
  @Input() estadoAprobado = false;
  @Input() visualizarImpuestosVenta = false;
  @Input() visualizarImpuestosCompra = false;
  @Output() emitirImpuestoAgregado: EventEmitter<any> = new EventEmitter();
  @Output() emitirImpuestoElimiando: EventEmitter<any> = new EventEmitter();

  @Input() impuestosSeleccionados: ImpuestoRespuestaConsulta[] = [];
  @Output() emitirImpuestosModificados: EventEmitter<
    ImpuestoRespuestaConsulta[]
  > = new EventEmitter<ImpuestoRespuestaConsulta[]>();

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['impuestosSeleccionados']) {
      const currentImpuestos = changes['impuestosSeleccionados'].currentValue;

      const impuestosAdaptados = currentImpuestos.map(
        (impuesto: ImpuestoFormulario) =>
          this._adapterService.adaptarImpuestoParaSelector(impuesto)
      );

      if (Array.isArray(currentImpuestos)) {
        this.impuestos = [...impuestosAdaptados];
      }
    }

    this.changeDetectorRef.detectChanges();
  }

  agregarImpuesto(impuesto: ImpuestoRespuestaConsulta) {
    //Verificar si el impuesto ya existe en el array
    const impuestoExistente = this.impuestos.find(
      (impuestoSeleccionado: any) =>
        impuestoSeleccionado.impuesto_id === impuesto.impuesto_id
    );

    if (!impuestoExistente) {
      this.impuestos.push(impuesto);
      this.emitirImpuestosModificados.emit(this.impuestos);
    } else {
      this.alertaService.mensajeError(
        'Error',
        'El producto ya cuenta con este impuesto seleccionado'
      );
    }
  }

  removerItem(impuesto: ImpuestoRespuestaConsulta) {
    if (!this.estadoAprobado) {
      this.impuestos = this.impuestos.filter((i) => i !== impuesto);
      this.emitirImpuestosModificados.emit(this.impuestos);
    }
  }

  consultarImpuesto() {
    this.alertaService.cerrarMensajes()
    switch (this.formularioTipo) {
      case 'compra':
        this.arrParametrosConsulta.filtros = [
          {
            propiedad: 'compra',
            valor1: true,
          },
        ];
        break;
      case 'venta':
        this.arrParametrosConsulta.filtros = [
          {
            propiedad: 'venta',
            valor1: true,
          },
        ];
        break;
    }

    this.listaDeImpuestosSeleccionables$ = this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarGenImpuesto>(
        this.arrParametrosConsulta
      )
      .pipe(map((respuesta) => respuesta.registros));
  }
}
