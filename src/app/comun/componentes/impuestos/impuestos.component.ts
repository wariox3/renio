import { Component } from '@angular/core';
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

  constructor(private httpService: HttpService) {
    super();
  }


  addimpuesto(impuesto: Impuesto) {
    console.log(impuesto);

    this.arrImpuestoSeleccionados.push(impuesto)
    this.changeDetectorRef.detectChanges()
  }

  removerItem(id: number){
    this.arrImpuestoSeleccionados = this.arrImpuestoSeleccionados.filter((index:Impuesto)=>index.id !== id)
    this.changeDetectorRef.detectChanges()
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
