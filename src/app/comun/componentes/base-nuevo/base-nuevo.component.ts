import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { General } from '@comun/clases/general';
import { componeteNuevos, componeteDetalle } from '@comun/extra/imports';

@Component({
  selector: 'app-comun-base-nuevo',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, TranslationModule],
  templateUrl: './base-nuevo.component.html',
  styleUrls: ['./base-nuevo.component.scss'],
})
export class BaseNuevoComponent extends General implements OnInit, AfterViewInit {
  modelo: string;
  formulario: string;
  tipo: string;
  accion: 'nuevo' | 'detalle';

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.modelo = this.activatedRoute.snapshot.queryParams['modelo'];
    this.tipo = this.activatedRoute.snapshot.queryParams['tipo'];
    this.formulario = this.activatedRoute.snapshot.queryParams['formulario'];
    this.accion = this.activatedRoute.snapshot.queryParams['accion'];
  }

  ngAfterViewInit() {
    this.loadComponente();
  }
  
  async loadComponente() {
    let posicionNuevo: keyof typeof componeteNuevos = `${this.modelo}-${this.formulario}`;
    let componeteNuevo = await (await componeteNuevos[posicionNuevo]).default;
    let componeteNuevoCargado =
      this.componenteDinamico.createComponent(componeteNuevo);
      componeteNuevoCargado.changeDetectorRef.detectChanges();
  }
}
