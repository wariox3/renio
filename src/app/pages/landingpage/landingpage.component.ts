import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent {

  estadoMenu = false
  menufijo = false

  abrirMenu(){
    if(window.innerWidth <= 991){
      this.estadoMenu = true
    }
  }

  cerrarMenu(){
    this.estadoMenu = false
  }


  @HostListener("window:scroll", ['$event'])
  doSomethingOnWindowsScroll($event:Event){
    let scrollOffset = document.documentElement.scrollTop || document.body.scrollTop;

    if(scrollOffset >= 200){
      this.menufijo = true
    } else {
      this.menufijo = false
    }

  }

}
