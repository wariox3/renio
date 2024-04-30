import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '../../../../../comun/componentes/tabla/tabla.component';
import { General } from '@comun/clases/general';
import { documentos } from '@comun/extra/mapeoEntidades/documentos';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { HttpService } from '@comun/services/http.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-factura-electronica',
  standalone: true,
  templateUrl: './factura-electronica.component.html',
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
  ],
})
export class FacturaElectronicaComponent
  extends General
  implements OnInit
{
  arrParametrosConsulta: any = {
    filtros: [
      {
        propiedad: 'estado_aprobado',
        valor1: true,
      },
      {
        propiedad: 'estado_electronico',
        valor1: true,
      },
    ],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    documento_clase_id: '100',
  };
  arrItems: any;
  arrRegistrosSeleccionados: number[] = [];
  selectAll = false;

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.modelo = localStorage.getItem('itemNombre')!;
      let posicion: keyof typeof documentos = parseInt(
        parametro.documento_clase
      );
      this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[posicion] }));
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    this.httpService
      .post('general/documento/lista/', {
        ...this.arrParametrosConsulta,
        ...{
          documento_clase_id: 100,
        },
      })
      .subscribe((respuesta: any) => {
        this.arrItems = respuesta.map((item: any) => ({
          ...item,
          ...{
            selected: false,
          },
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  // Esta función agrega o elimina un registro del array de registros a eliminar según su presencia actual en el array.
  agregarRegistrosEliminar(id: number) {
    // Busca el índice del registro en el array de registros a eliminar
    const index = this.arrRegistrosSeleccionados.indexOf(id);
    // Si el registro ya está en el array, lo elimina
    if (index !== -1) {
      this.arrRegistrosSeleccionados.splice(index, 1);
    } else {
      // Si el registro no está en el array, lo agrega
      this.arrRegistrosSeleccionados.push(id);
    }
  }

  // Esta función alterna la selección de todos los registros y actualiza el array de registros a eliminar en consecuencia.
  toggleSelectAll() {
    // Itera sobre todos los datos
    this.arrItems.forEach((item: any) => {
      // Establece el estado de selección de cada registro
      item.selected = !item.selected;
      // Busca el índice del registro en el array de registros a eliminar
      const index = this.arrRegistrosSeleccionados.indexOf(item.id);
      // Si el registro ya estaba en el array de registros a eliminar, lo elimina
      if (index !== -1) {
        this.arrRegistrosSeleccionados.splice(index, 1);
      } else {
        // Si el registro no estaba en el array de registros a eliminar, lo agrega
        this.arrRegistrosSeleccionados.push(item.id);
      }
    });
    // Alterna el estado de selección de todos los registros
    this.selectAll = !this.selectAll;
    this.changeDetectorRef.detectChanges();
  }

  emitir() {
    if (this.arrRegistrosSeleccionados.length >= 1) {
      this.arrRegistrosSeleccionados.map((documento_id) => {
        // this.httpService
        // .post('general/documento/emitir/', { documento_id: this.detalle })
        // .subscribe((respuesta: any) => {
        //   this.alertaService.mensajaExitoso('Documento aprobado');
        //   this.consultarLista();
        // });
      })
    } else {
      this.alertaService.mensajeError(
        'Error',
        'No tiene registros seleccionados'
      );
    }
  }

  notificar() {}
}
