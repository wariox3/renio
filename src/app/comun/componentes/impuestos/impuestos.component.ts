import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

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

  arrImpuesto:any[] = []

  addimpuesto() {
    this.arrImpuesto.push({
      "clave":1,
      "valor":2
    })
    this.changeDetectorRef.detectChanges()
  }

  removerItem(id: number){    
    this.arrImpuesto = this.arrImpuesto.filter((index:any)=>index.clave !== id)
    this.changeDetectorRef.detectChanges()
  }
}
