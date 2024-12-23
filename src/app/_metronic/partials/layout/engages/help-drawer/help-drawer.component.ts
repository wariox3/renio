import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';
import { TranslateModule } from '@ngx-translate/core';
import { General } from '@comun/clases/general';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-help-drawer',
  templateUrl: './help-drawer.component.html',
  standalone: true,
  imports: [AsyncPipe ,TranslateModule, KeeniconComponent, NgbTooltipModule],
})
export class HelpDrawerComponent extends General implements OnInit {
  appDocumentacion: string = environment.appDocumentacion;
  documentacionId$: Observable<number>;
  enlaseDocumentacion$: BehaviorSubject<string>;

  constructor() {
    super()
  }

  ngOnInit() {
    // this.documentacionId$ = this.store.select(obtenerDocumentacionIdSeleccion);
    // this.enlaseDocumentacion$ = this.documentacionId$.pipe(
    //   map((id) => `${this.appDocumentacion}${id ?? 0}`) // Asegúrate de manejar null o undefined
    // );
    this.activatedRoute.queryParams.subscribe((parametros) => {
      console.log(parametros);

      this.enlaseDocumentacion$.next( `${this.appDocumentacion}`)
      if(this.parametrosUrl?.documento_clase == 301){
        this.modelo = 'notacreditocompra'
        this.changeDetectorRef.detectChanges()
      }
      if(this.parametrosUrl?.documento_clase == 302){
        this.modelo = 'notadebitocompra'
        this.changeDetectorRef.detectChanges()
      }
    })
  }

  tooltipTexto(): string {
    return 'Ir a la documentación de: ' + this.translateService.instant('MENU.FUNCIONALIDAD.'+this.modelo);
  }
}
