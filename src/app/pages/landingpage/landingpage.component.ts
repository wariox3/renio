import { Component, OnChanges } from '@angular/core';
import { of } from 'rxjs';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent {

  estadoMenu = false

  abrirMenu(){
    if(window.innerWidth <= 991){
      this.estadoMenu = true
    }
  }

  cerrarMenu(){
    this.estadoMenu = false
  }

}
