import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { General } from '@comun/clases/general';
import { componeteNuevos } from '@comun/extra/imports';
import { FacturaService } from '@modulos/venta/servicios/factura.service';

@Component({
  selector: 'app-comun-base-nuevo',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, TranslationModule],
  templateUrl: './base-nuevo.component.html',
  styleUrls: ['./base-nuevo.component.scss'],
})
export class BaseNuevoComponent extends General implements AfterViewInit {


  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;

  constructor() {
    super();
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

  aprobar() {
    // this.facturaService.aprobar({
    //   'id':1
    // }).subscribe()
  }
}
