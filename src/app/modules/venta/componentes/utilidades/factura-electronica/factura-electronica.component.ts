import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '../../../../../comun/componentes/tabla/tabla.component';
import { General } from '@comun/clases/general';
import { documentos } from '@comun/extra/mapeoEntidades/documentos';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { HttpService } from '@comun/services/http.service';

@Component({
  selector: 'app-factura-electronica',
  standalone: true,
  templateUrl: './factura-electronica.component.html',
  imports: [CommonModule, CardComponent, TablaComponent],
})
export default class FacturaElectronicaComponent
  extends General
  implements OnInit
{
  arrParametrosConsulta: any = {
    filtros: [
      {
        propiedad: 'estado_electronico__no_is',
        operador: '__no_is',
        valor1: true,
      },
      {
        propiedad: 'estado_notificado__no_is',
        operador: '__no_is',
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

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.modelo = localStorage.getItem('itemNombre')!;
      let posicion: keyof typeof documentos = parseInt(
        parametro.documento_clase
      );
      console.log(posicion);
      
      this.store.dispatch(ActualizarMapeo({ dataMapeo: documentos[posicion] }));
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarLista() {
    // this.httpService
    //   .post<{
    //     registros: any;
    //   }>('general/documento/lista/', {
    //     ...this.arrParametrosConsulta,
    //     ...{
    //       documento_clase_id: 100,
    //     },
    //   })
    //   .subscribe((respuesta) => {
    //     this.arrItems = respuesta;
    //     this.changeDetectorRef.detectChanges();
    //   });
  }
}
