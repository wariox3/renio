import { CommonModule, } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { NgbNavConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { EmpresaFormularioComponent } from '../empresa-formulario/empresa-fomrulario.component';

@Component({
  selector: 'app-empresa-pasoapaso',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    CardComponent,
    EmpresaFormularioComponent
  ],
  templateUrl: './empresa-pasoapaso.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgbNavConfig], // add NgbNavConfig to the component providers
})
export class EmpresaPasoapasoComponent  {
  navActivo = 1
  navCompleto: number[] = []

  navSiguiente(numero: number){
    this.navActivo = numero
    this.navCompleto.push(numero)
  }

  continuarPaso(event: any){
    this.navActivo = 2
    this.navCompleto.push(1)
  }
}

