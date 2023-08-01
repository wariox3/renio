import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule, ViewportScroller } from "@angular/common";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BtnwhatsappComponent } from '@comun/componentes/btnwhatsapp/btnwhatsapp.component';

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss'],
  standalone: true,
  imports:[
    BtnwhatsappComponent,
    CommonModule,
    RouterModule
  ]
})
export class LandingpageComponent implements OnInit {

  estadoMenu = false
  menufijo = false
  animateFadeDown = false;


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
    this.animateFadeDown = scrollOffset >= 200;
    this.menufijo =  scrollOffset >= 200;
  }

}
