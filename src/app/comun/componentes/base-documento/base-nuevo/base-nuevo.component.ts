import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { General } from '@comun/clases/general';
import { Componentes } from '@comun/extra/imports/documentos';
import { HttpService } from '@comun/services/http.service';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { Modelo } from '@comun/type/modelo.type';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-comun-base-nuevo',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './base-nuevo.component.html',
})
export class BaseNuevoComponent
  extends General
  implements AfterViewInit, OnDestroy
{
  private readonly _configModuleService = inject(ConfigModuleService);
  private key: number | Modelo | null | undefined;
  generarPDF = false;
  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  componenteDinamico: ViewContainerRef;
  private _destroy$ = new Subject<void>();

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  ngAfterViewInit() {
    this.loadComponente();
  }

  async loadComponente() {
    this._configModuleService.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe(async (value) => {
        this.componenteDinamico.clear();
        this.key = this._configModuleService.key;
        const componenteClase = Componentes[this.key!];
        if (componenteClase && componenteClase.formulario) {
          let componete = await (await componenteClase.formulario()).default;
          let componeteCargado =
            this.componenteDinamico.createComponent(componete);
          componeteCargado.changeDetectorRef.detectChanges();
        } else {
          console.error('El componente o su método formulario es indefinido');
        }
      });
  }

  emitir() {
    this.httpService
      .post('general/documento/emitir/', { id: this.detalle })
      .subscribe((respuesta: any) => {
        this.alertaService.mensajaExitoso('Documento aprobado');
        window.location.reload();
      });
  }

  imprimir() {
    this.generarPDF = true;
    this.httpService.descargarArchivo('general/documento/imprimir/', {
      filtros: [],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: '',
      tipo: '',
      documento_tipo_id: 1,
      documento_id: this.detalle,
    });
  }
}
