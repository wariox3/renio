import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { Impuesto } from '@modulos/general/interfaces/impuesto.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { ImpuestoEditarComponent } from '../impuesto-editar/impuesto-editar.component';

@Component({
  selector: 'app-impuestos-lista',
  standalone: true,
  imports: [  CommonModule, TranslateModule, ImpuestoEditarComponent, SiNoPipe],
  templateUrl: './impuestos-lista.component.html',
})
export class ImpuestosListaComponent implements OnInit {
  private _generalService = inject(GeneralService);
  private _modalService = inject(NgbModal);

  arrImpuestoSignal = signal<Impuesto[]>([]);
  ImpuestoSeleccionado = signal<Impuesto>({
    id: 0,
    nombre: '',
    nombre_extendido: '',
    porcentaje: 0,
    compra: false,
    venta: false,
    porcentaje_base: 0,
    operacion: 0,
  });

  ngOnInit() {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this._generalService
      .consultarDatosLista({
        filtros: [],
        limite: 50,
        limite_conteo: 10000,
        desplazar: 0,
        ordenamientos: ['id'],
        modelo: 'GenImpuesto',
      })
      .subscribe((respuesta: any) => {
        this.arrImpuestoSignal.set(respuesta.registros);
      });
  }

  navegarEditar(impuesto: Impuesto, content: any) {
    this.ImpuestoSeleccionado.set(impuesto);
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  cerrarModal($event: Event) {
    this.consultarInformacion();
    this._modalService.dismissAll();
  }
}
