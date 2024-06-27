import { CommonModule, } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbNavConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-empresa-pasoapaso',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule
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

}

