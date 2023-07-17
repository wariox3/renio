import { Component, HostListener } from '@angular/core';
import { ViewportScroller } from "@angular/common";

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent {

  estadoMenu = false
  menufijo = false

  constructor(private scroller: ViewportScroller) {}


  abrirMenu(){
    if(window.innerWidth <= 991){
      this.estadoMenu = true
    }
  }

  cerrarMenu(){
    this.estadoMenu = false
  }

  navegacionID(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
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
