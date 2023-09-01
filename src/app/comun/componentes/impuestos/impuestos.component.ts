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
import { Item } from '@modulos/general/modelos/item';

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
  arrImpuestoSeleccionados: Impuesto[] = [];
  arrImpuestoLista: Impuesto[];
  @Input() arrLista: any[];
  @Output() emitirImpuestoAgregado: EventEmitter<any> = new EventEmitter();
  @Output() emitirImpuestoElimiando: EventEmitter<any> = new EventEmitter();

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.arrLista.currentValue) {
      this.arrImpuestoSeleccionados = [];
      this.arrLista.map((impuesto: any) => {
        //     impuesto['id'] = `${impuesto['impuesto']}`;
        //     delete impuesto['impuesto'];

        //     const impuestoExistente = this.arrImpuestoSeleccionados.find(
        //       (imp) => imp.id === impuesto.id
        //     );
        //     if (!impuestoExistente) {
        this.arrImpuestoSeleccionados.push(impuesto);
        //     }
      });
      this.changeDetectorRef.detectChanges();
    }
  }

  agregarImpuesto(impuesto: any) {
    //Verificar si el impuesto ya existe en el array
    const impuestoExistente = this.arrImpuestoSeleccionados.find(
      (imp) => imp.id === impuesto.id
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
      (index: any) => index.impuesto !== impuesto.impuesto
    );
    this.changeDetectorRef.detectChanges();
    this.emitirImpuestoElimiando.emit(impuesto);
  }

  consultarImpuesto() {
    this.httpService
      .get<Impuesto>('general/impuesto/')
      .subscribe((respuesta) => {
        this.arrImpuestoLista = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }
}
