import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';

import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { HttpService } from '@comun/services/http.service';
import { AutocompletarRegistros, RegistroAutocompletarImpuesto } from '@interfaces/comunes/autocompletar';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs';

@Component({
  selector: 'app-comun-impuestos',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgbDropdownModule,
    SoloNumerosDirective,
],
  templateUrl: './impuestos.component.html',
  styleUrls: ['./impuestos.component.scss'],
})
export class ImpuestosComponent extends General implements OnChanges {
  arrImpuestoSeleccionados: any[] = [];
  arrImpuestoLista: any[];
  arrParametrosConsulta: any = {
    filtros: [],
    limite: 10,
    limite_conteo: 10000,
    modelo: 'GenImpuesto',
    serializador: "ListaAutocompletar"
  };
  @Input() arrLista: any[];
  @Input() estado_aprobado = false;
  @Input() visualizarImpuestosVenta = false;
  @Input() visualizarImpuestosCompra = false;
  @Output() emitirImpuestoAgregado: EventEmitter<any> = new EventEmitter();
  @Output() emitirImpuestoElimiando: EventEmitter<any> = new EventEmitter();

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.arrLista.currentValue) {
      this.arrImpuestoSeleccionados = [];
      let acumulador: any[];

      if(this.visualizarImpuestosVenta){
        acumulador = this.arrLista.filter((impuesto: any) => impuesto.impuesto_venta);
      } else {
        acumulador = this.arrLista.filter((impuesto: any) => impuesto.impuesto_compra);
      }
      acumulador.map((impuesto: any) => {
        const impuestoExistente = this.arrImpuestoSeleccionados.find(
          (impuestoSeleccionado: any) =>
            impuestoSeleccionado.impuesto_id === impuesto.impuesto_id
        );
        if (!impuestoExistente) {
          this.arrImpuestoSeleccionados.push(impuesto);
        }
      });
      this.changeDetectorRef.detectChanges();
    }
  }

  agregarImpuesto(impuesto: any) {
    //Verificar si el impuesto ya existe en el array
    const impuestoExistente = this.arrImpuestoSeleccionados.find(
      (impuestoSeleccionado: any) =>
        impuestoSeleccionado.impuesto_id === impuesto.impuesto_id
    );
    if (!impuestoExistente) {
      this.arrImpuestoSeleccionados.push(impuesto);
      this.emitirImpuestoAgregado.emit(impuesto);
    } else {
      this.alertaService.mensajeError(
        'Error',
        'El producto ya cuenta con este impuesto seleccionado'
      );
    }
  }

  removerItem(impuesto: any) {
    this.arrImpuestoSeleccionados = this.arrImpuestoSeleccionados.filter(
      (impuestoSeleccionado: any) =>
        impuestoSeleccionado.impuesto_id !== impuesto.impuesto_id
    );
    this.changeDetectorRef.detectChanges();
    this.emitirImpuestoElimiando.emit(impuesto);
  }

  consultarImpuesto() {
    if (this.visualizarImpuestosVenta) {
      this.arrParametrosConsulta.filtros = [
        //...this.arrParametrosConsulta.filtros,
        {
          propiedad: 'venta',
          valor1: true,
        },
      ];
    }
    if (this.visualizarImpuestosCompra) {
      this.arrParametrosConsulta.filtros = [
        //...this.arrParametrosConsulta.filtros,
        {
          propiedad: 'compra',
          valor1: true,
        },
      ];
    }
    this.httpService
      .post<AutocompletarRegistros<RegistroAutocompletarImpuesto>>(
        'general/funcionalidad/lista/',
        this.arrParametrosConsulta
      )
      .pipe(
        tap((respuesta) => {
          this.arrImpuestoLista = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }
}
