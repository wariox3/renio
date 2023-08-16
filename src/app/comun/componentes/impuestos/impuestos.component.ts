import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Impuesto } from '@interfaces/general/impuesto';
import { HttpService } from '@comun/services/http.service';

@Component({
  selector: 'app-comun-impuestos',
  standalone: true,
  imports: [CommonModule,
    TranslateModule,
    TranslationModule,
    NgbDropdownModule],
  templateUrl: './impuestos.component.html',
  styleUrls: ['./impuestos.component.scss']
})
export class ImpuestosComponent extends General  {

  arrImpuestoSeleccionados:Impuesto[] = []
  arrImpuestoLista:Impuesto[]
  @Output() emitirImpuestos: EventEmitter<any> = new EventEmitter()
  @Output() emitirImpuesto: EventEmitter<any> = new EventEmitter()

  constructor(private httpService: HttpService) {
    super();
  }


  agregarImpuesto(impuesto: Impuesto) {
    this.arrImpuestoSeleccionados.push(impuesto)
    this.changeDetectorRef.detectChanges()
    this.emitirImpuestos.emit(impuesto)
  }

  removerItem(impuesto: Impuesto){
    this.arrImpuestoSeleccionados = this.arrImpuestoSeleccionados.filter((index:Impuesto)=>index.id !== impuesto.id)
    this.changeDetectorRef.detectChanges()
    this.emitirImpuesto.emit(impuesto)
  }

  consultarImpuesto(){
    this.httpService
    .get<Impuesto>('general/impuesto/')
    .subscribe((respuesta) => {
      this.arrImpuestoLista = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }
}
