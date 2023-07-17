import { Component, HostListener, OnInit } from '@angular/core';
import { ViewportScroller } from "@angular/common";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent implements OnInit {

  estadoMenu = false
  menufijo = false

  constructor(private scroller: ViewportScroller, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const fragment = this.activatedRoute.fragment.subscribe(fragment => {
      if(fragment){
        document.getElementById(fragment)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest"
        });
      }

    });
  }

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
