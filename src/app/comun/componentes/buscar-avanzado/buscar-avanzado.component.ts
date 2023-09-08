import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TablaComponent } from '../tabla/tabla.component';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { KeysPipe } from '@pipe/keys.pipe';

@Component({
  selector: 'app-buscar-avanzado',
  standalone: true,
  imports: [CommonModule, NgbDatepickerModule, TablaComponent, KeysPipe],
  templateUrl: './buscar-avanzado.component.html',
  styleUrls: ['./buscar-avanzado.component.scss']
})
export class BuscarAvanzadoComponent extends General {
	closeResult = '';
  arrPropiedades: Listafiltros[];
  ordenadoTabla: string = '';
  arrItems: any[];
  @Input() consultarModelo = ""
  @Output() emitirRegistroSeleccionado: EventEmitter<any> = new EventEmitter();
  constructor(private modalService: NgbModal, private httpService: HttpService) {
    super()
  }

  abirModal(content:any){
    let baseUrl = 'general/';
    switch (this.tipo) {
      case 'Administrador':
        baseUrl += 'funcionalidad/lista-administrador/';
        break;
      case 'Documento':
        baseUrl += 'documento/lista/';
        break;
    }


    let arrParametrosConsulta = {
      filtros: [],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: '',
      tipo: '',
      documento_tipo_id: 1,
    };


    this.httpService
      .post<{
        cantidad_registros: number;
        registros: any[];
        propiedades: any[];
      }>(baseUrl, arrParametrosConsulta)
      .subscribe((respuesta) => {
        this.arrItems = respuesta.registros;
        this.arrPropiedades = respuesta.propiedades;
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' })

        this.changeDetectorRef.detectChanges();
      });




  }

  orderPor(nombre: string, i: number) {
    if (this.ordenadoTabla.charAt(0) == '-') {
      this.ordenadoTabla = nombre.toLowerCase();
    } else {
      this.ordenadoTabla = `-${nombre.toLowerCase()}`;
    }
  }

  seleccionar(item:any){
    this.emitirRegistroSeleccionado.emit(item)
  }

}
