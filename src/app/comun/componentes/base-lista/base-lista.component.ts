import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { CardComponent } from '../card/card.component';
import { BaseFiltroComponent } from '../base-filtro/base-filtro.component';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { TablaComponent } from '../tabla/tabla.component';

@Component({
  selector: 'app-comun-base-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    TranslationModule,
    CardComponent,
    BaseFiltroComponent,
    TablaComponent,
  ],
  templateUrl: './base-lista.component.html',
  styleUrls: ['./base-lista.component.scss'],
})
export class BaseListaComponent extends General implements OnInit {
  arrParametrosConsulta: any = {
    filtros: [],
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: '',
    tipo: '',
    documento_tipo_id: 1,
  };
  arrPropiedades: Listafiltros[];
  arrItems: any[];
  cantidad_registros!: number;

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.arrParametrosConsulta.modelo = parametro.modelo;
      this.arrParametrosConsulta.tipo = parametro.tipo;
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();

  }

  consultarLista(): void {
    let baseUrl = 'general/funcionalidad/lista-'
    switch (this.arrParametrosConsulta.tipo) {
      case 'Administrador':
        baseUrl += 'administrador/';
        break;
      case 'Documento':
        baseUrl += 'documento/';
        break;
    }
    this.httpService
      .post<{
        cantidad_registros: number;
        registros: any[];
        propiedades: any[];
      }>(baseUrl , this.arrParametrosConsulta)
      .subscribe((respuesta) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrItems = respuesta.registros;
        this.arrPropiedades = respuesta.propiedades;
        this.changeDetectorRef.detectChanges();
      });
  }

  obtenerFiltros(arrfiltros: any) {
    this.arrParametrosConsulta.filtros = arrfiltros;
    this.consultarLista();
  }

  cambiarOrdemiento(ordenamiento: string) {
    (this.arrParametrosConsulta.ordenamientos[0] = ordenamiento),
      this.consultarLista();
  }

  cambiarPaginacion(data: { desplazamiento: number; limite: number }) {
    this.arrParametrosConsulta.limite = data.desplazamiento;
    this.arrParametrosConsulta.desplazar = data.limite;
    this.consultarLista();
  }

  cambiarDesplazamiento(desplazamiento: number) {
    this.arrParametrosConsulta.desplazar = desplazamiento;
    this.consultarLista();
  }

  nuevo() {
    this.router.navigate(['/nuevo'], {
      queryParams: {
        modelo: this.arrParametrosConsulta.modelo,
        tipo: this.arrParametrosConsulta.tipo,
        formulario: `${this.arrParametrosConsulta.modelo}Nuevo`,
      },
    });
  }

  detalle(id: number) {
    this.router.navigate(['/detalle'], {
      queryParams: {
        modelo: this.arrParametrosConsulta.modelo,
        tipo: this.arrParametrosConsulta.tipo,
        detalle: id,
      },
    });
  }
}
