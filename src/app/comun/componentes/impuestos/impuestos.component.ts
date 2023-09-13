import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Impuesto } from '@interfaces/general/impuesto';
import { HttpService } from '@comun/services/http.service';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { Item } from '@interfaces/general/item';
import { tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-comun-impuestos',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
    SoloNumerosDirective,
  ],
  templateUrl: './impuestos.component.html',
  styleUrls: ['./impuestos.component.scss'],
})
export class ImpuestosComponent extends General implements OnChanges {
  arrImpuestoSeleccionados: any[] = [];
  arrImpuestoLista: any[];
  @Input() arrLista: any[];
  @Input() estado_aprobado= false;
  @Output() emitirImpuestoAgregado: EventEmitter<any> = new EventEmitter();
  @Output() emitirImpuestoElimiando: EventEmitter<any> = new EventEmitter();

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.arrLista.currentValue) {
      this.arrImpuestoSeleccionados = [];
      this.arrLista.map((impuesto: any) => {
        const impuestoExistente = this.arrImpuestoSeleccionados.find(
          (impuestoSeleccionado: any) => impuestoSeleccionado.impuesto_id === impuesto.impuesto_id
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
      (impuestoSeleccionado: any) => impuestoSeleccionado.impuesto_id === impuesto.impuesto_id
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
      (impuestoSeleccionado: any) => impuestoSeleccionado.impuesto_id !== impuesto.impuesto_id
    );
    this.changeDetectorRef.detectChanges();
    this.emitirImpuestoElimiando.emit(impuesto);
  }

  consultarImpuesto() {


    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
              operador: '__contains',
              propiedad: 'nombre__contains',
              valor1: '',
              valor2: '',
            },
          ],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'Impuesto',
        }
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
