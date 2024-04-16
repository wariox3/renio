import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TablaComponent } from '../tabla/tabla.component';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { KeysPipe } from '@pipe/keys.pipe';
import { BaseFiltroComponent } from '../base-filtro/base-filtro.component';
import { TranslationModule } from '@modulos/i18n';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-comun-buscar-avanzado',
  standalone: true,
  imports: [
    CommonModule,
    NgbDatepickerModule,
    TablaComponent,
    KeysPipe,
    BaseFiltroComponent,
    TranslateModule,
    TranslationModule,
  ],
  templateUrl: './buscar-avanzado.component.html',
  styleUrls: ['./buscar-avanzado.component.scss'],
})
export class BuscarAvanzadoComponent extends General {
  closeResult = '';
  arrPropiedades: Listafiltros[];
  ordenadoTabla: string = '';
  arrItems: any[];
  @Input() consultarModelo = '';
  @Input() consultarTipo: 'Administrador' | 'Documento';
  @Output() emitirRegistroSeleccionado: EventEmitter<any> = new EventEmitter();

  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: '',
    tipo: '',
  };

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService
  ) {
    super();
  }

  abirModal(content: any) {
    this.consultarLista();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  obtenerFiltros(arrfiltros: any) {
    this.arrParametrosConsulta.filtros = arrfiltros;
    this.consultarLista();
  }

  consultarLista() {
    this.arrParametrosConsulta.modelo = this.consultarModelo;
    this.arrParametrosConsulta.tipo = this.consultarTipo;
    let baseUrl = 'general/';
    switch (this.consultarTipo) {
      case 'Administrador':
        baseUrl += 'funcionalidad/lista-administrador/';
        break;
      case 'Documento':
        baseUrl += 'documento/lista/';
        let dataUrl = JSON.parse(this.data);
        this.arrParametrosConsulta['documento_tipo_id'] = dataUrl.documento_tipo
        this.arrParametrosConsulta['documento_clase_id'] = dataUrl.documento_clase
        break;
    }

    this.httpService
      .post<{
        cantidad_registros: number;
        registros: any[];
        propiedades: any[];
      }>(baseUrl, this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        this.arrItems = respuesta.registros;
        this.arrPropiedades = respuesta.propiedades;
      });
  }
  orderPor(nombre: string, i: number) {
    if (this.ordenadoTabla.charAt(0) == '-') {
      this.ordenadoTabla = nombre.toLowerCase();
    } else {
      this.ordenadoTabla = `-${nombre.toLowerCase()}`;
    }
  }

  seleccionar(item: any) {
    this.modalService.dismissAll();
    this.emitirRegistroSeleccionado.emit(item);
  }
}
