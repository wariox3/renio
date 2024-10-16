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
import { TranslateModule } from '@ngx-translate/core';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { HttpService } from '@comun/services/http.service';
import {
  AutocompletarRegistros,
  RegistroAutocompletarImpuesto,
} from '@interfaces/comunes/autocompletar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { map, Observable, tap } from 'rxjs';
import {
  ImpuestoFormulario,
  ImpuestoRespuestaConsulta,
} from '@interfaces/comunes/factura/factura.interface';
import { AdapterService } from '../../services/adapter.service';

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
  public impuestos: ImpuestoRespuestaConsulta[] = [];
  public listaDeImpuestosSeleccionables$: Observable<
    RegistroAutocompletarImpuesto[]
  > = new Observable();

  arrImpuestoSeleccionados: any[] = [];
  arrImpuestoLista: any[];
  arrParametrosConsulta: any = {
    filtros: [],
    limite: 10,
    limite_conteo: 10000,
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

  constructor(private httpService: HttpService) {
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
    // if (changes.arrLista.currentValue) {
    //   this.arrImpuestoSeleccionados = [];
    //   let acumulador: any[];

    //   if (this.visualizarImpuestosVenta) {
    //     acumulador = this.arrLista.filter(
    //       (impuesto: any) => impuesto.impuesto_venta
    //     );
    //   } else {
    //     acumulador = this.arrLista.filter(
    //       (impuesto: any) => impuesto.impuesto_compra
    //     );
    //   }
    //   acumulador.map((impuesto: any) => {
    //     const impuestoExistente = this.arrImpuestoSeleccionados.find(
    //       (impuestoSeleccionado: any) =>
    //         impuestoSeleccionado.impuesto_id === impuesto.impuesto_id
    //     );
    //     if (!impuestoExistente) {
    //       this.arrImpuestoSeleccionados.push(impuesto);
    //     }
    //   });
    //   this.changeDetectorRef.detectChanges();
    // }
  }

  agregarImpuesto(impuesto: ImpuestoRespuestaConsulta) {
    //Verificar si el impuesto ya existe en el array
    const impuestoExistente = this.impuestos.find(
      (impuestoSeleccionado: any) =>
        impuestoSeleccionado.impuesto_id === impuesto.impuesto_id
    );

    // if (index > -1) {
    //   this.impuestos.splice(index, 1);
    // } else {
    //   this.impuestos.push(impuesto);
    // }

    if (!impuestoExistente) {
      this.impuestos.push(impuesto);
      this.emitirImpuestosModificados.emit(this.impuestos);
    } else {
      this.alertaService.mensajeError(
        'Error',
        'El producto ya cuenta con este impuesto seleccionado'
      );
    }

    // const impuestoExistente = this.arrImpuestoSeleccionados.find(
    //   (impuestoSeleccionado: any) =>
    //     impuestoSeleccionado.impuesto_id === impuesto.impuesto_id
    // );
    // if (!impuestoExistente) {
    //   this.arrImpuestoSeleccionados.push(impuesto);
    //   this.emitirImpuestoAgregado.emit(impuesto);
    // } else {
    //   this.alertaService.mensajeError(
    //     'Error',
    //     'El producto ya cuenta con este impuesto seleccionado'
    //   );
    // }
  }

  removerItem(impuesto: ImpuestoRespuestaConsulta) {
    if (!this.estadoAprobado) {
      this.impuestos = this.impuestos.filter((i) => i !== impuesto);
      this.emitirImpuestosModificados.emit(this.impuestos);
    }
    // this.arrImpuestoSeleccionados = this.arrImpuestoSeleccionados.filter(
    //   (impuestoSeleccionado: any) =>
    //     impuestoSeleccionado.impuesto_id !== impuesto.impuesto_id
    // );
    // this.changeDetectorRef.detectChanges();
    // this.emitirImpuestoElimiando.emit(impuesto);
  }

  consultarImpuesto() {
    switch (this.formularioTipo) {
      case 'compra':
        this.arrParametrosConsulta.filtros = [
          //...this.arrParametrosConsulta.filtros,
          {
            propiedad: 'compra',
            valor1: true,
          },
        ];
        break;
      case 'venta':
        this.arrParametrosConsulta.filtros = [
          //...this.arrParametrosConsulta.filtros,
          {
            propiedad: 'venta',
            valor1: true,
          },
        ];
        break;
    }

    this.listaDeImpuestosSeleccionables$ = this.httpService
      .post<AutocompletarRegistros<RegistroAutocompletarImpuesto>>(
        'general/funcionalidad/lista/',
        this.arrParametrosConsulta
      )
      .pipe(map((respuesta) => respuesta.registros));
  }
}
