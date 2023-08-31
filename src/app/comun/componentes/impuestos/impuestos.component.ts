import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
  @Input() arrLista: Impuesto[];
  @Output() emitirImpuestos: EventEmitter<any> = new EventEmitter();
  @Output() emitirImpuesto: EventEmitter<any> = new EventEmitter();

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.arrLista.currentValue){
      this.arrLista.map((impuesto: any) => {
        impuesto['nombre'] = impuesto.impuesto_nombre
        delete impuesto.impuesto_nombre
        this.agregarImpuesto(impuesto)
      })
    }
  }

  agregarImpuesto(impuesto: Impuesto) {
    // Verificar si el impuesto ya existe en el array
    const impuestoExistente = this.arrImpuestoSeleccionados.find(
      imp => imp.id === impuesto.id
    );
    if (!impuestoExistente) {
      this.arrImpuestoSeleccionados.push(impuesto);
      this.changeDetectorRef.detectChanges();
      this.emitirImpuestos.emit(impuesto);
    } else {
      this.alertaService.mensajeError("Error", "El producto ya cuenta con este impuesto seleccionado")
    }
  }

  removerItem(impuesto: Impuesto) {
    this.arrImpuestoSeleccionados = this.arrImpuestoSeleccionados.filter(
      (index: Impuesto) => index.id !== impuesto.id
    );
    this.changeDetectorRef.detectChanges();
    this.emitirImpuesto.emit(impuesto);
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
