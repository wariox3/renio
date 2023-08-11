import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { General } from '@comun/clases/general';
import { componeteNuevos } from '@comun/extra/imports';


@Component({
  selector: 'app-comun-base-nuevo',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, TranslationModule],
  templateUrl: './base-nuevo.component.html',
  styleUrls: ['./base-nuevo.component.scss'],
})
export class BaseNuevoComponent  extends General implements OnInit {

  modelo: string;
  formulario: string

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.modelo = this.activatedRoute.snapshot.queryParams['modelo'];
    this.formulario = this.activatedRoute.snapshot.queryParams['formulario'];
    this.loadComponente();
  }

  async loadComponente() {
    let posicion: keyof typeof componeteNuevos = `${this.modelo}-formulario${this.formulario}`;
    let componete  = await (await componeteNuevos[posicion]).default
    let componeteCreado = this.componenteDinamico.createComponent(componete);
    let loadedComponentInstance:any = componeteCreado.instance;
    loadedComponentInstance.ngOnInit()
  }


}
