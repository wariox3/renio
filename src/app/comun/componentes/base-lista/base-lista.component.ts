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
  };
  arrPropiedades: Listafiltros[];

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnInit(): void {
    this.arrParametrosConsulta.modelo = this.activatedRoute.snapshot.fragment;
    this.consultarLista();
  }

  consultarLista(): void {
    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/item/lista/',
        this.arrParametrosConsulta
      )
      .subscribe((respuesta) => {
        // this.cantidad_registros = respuesta.cantidad_registros
        // this.arrItems = respuesta.registros;
        this.arrPropiedades = [
          {
            tipo: 'Texto',
            valor: 'nombre',
          },
          {
            tipo: 'Texto',
            valor: 'codigo',
          },
          {
            tipo: 'Texto',
            valor: 'referencia',
          },
          {
            tipo: 'Numero',
            valor: 'costo',
          },
          {
            tipo: 'Numero',
            valor: 'precio',
          },
          {
            tipo: 'Numero',
            valor: 'Id',
          },
        ];
        this.changeDetectorRef.detectChanges();
      });
  }

  obtenerFiltros(arrfiltros: any) {
    this.arrParametrosConsulta.filtros = arrfiltros
    this.consultarLista();
  }

}
