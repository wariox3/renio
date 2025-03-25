import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { BaseFiltroComponent } from '@comun/componentes/base-filtro/base-filtro.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { documentos } from '@comun/extra/mapeo-entidades/informes';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { FechasService } from '@comun/services/fechas.service';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { CarteraService } from '@modulos/cartera/services/cartera.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActualizarMapeo } from '@redux/actions/menu.actions';

@Component({
  selector: 'app-cuentas-cobrar-corte',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TablaComponent,
    TranslateModule,
    BaseFiltroComponent,
  ],
  templateUrl: './cuentas-cobrar-corte.component.html',
})
export class CuentasCobrarCorteComponent extends General implements OnInit {
  private _fechaService = inject(FechasService);
  private _carteraService = inject(CarteraService);
  arrDocumentos: any = [];
  cantidad_registros!: number;
  filtroPermanente: Filtros[] = [];
  arrParametrosConsulta: ParametrosFiltros = {
    filtros: this.filtroPermanente,
    limite: 50,
    desplazar: 0,
    ordenamientos: [],
    limite_conteo: 10000,
    modelo: 'GenDocumento',
    serializador: 'Informe',
  };

  public filtroKey = 'cartera_cuentascobrarcorte';

  constructor(private descargarArchivosService: DescargarArchivosService) {
    super();
  }

  ngOnInit(): void {
    this._cargarFiltrosPredeterminados();
    this._construirFiltros();
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.store.dispatch(
        ActualizarMapeo({ dataMapeo: documentos['cuentas_cobrar_corte'] }),
      );
      this.consultarLista();
    });
    this.changeDetectorRef.detectChanges();
  }

  private _cargarFiltrosPredeterminados() {
    const currentDate = this._fechaService.obtenerFechaActualFormateada();

    const filtroValue = [
      {
        propiedad: 'fecha',
        operadorFiltro: 'exact',
        valor1: currentDate,
        tipo: 'DateField',
        operador: 'exact',
        campo: 'fecha',
      },
    ];

    localStorage.setItem(this.filtroKey, JSON.stringify(filtroValue));
  }

  consultarLista() {
    this._carteraService
      .consultarCuentaCobrarCorte(this.arrParametrosConsulta)
      .subscribe((respuesta: any) => {
        this.cantidad_registros = respuesta.cantidad_registros;
        this.arrDocumentos = respuesta.registros.map((documento: any) => ({
          id: documento.id,
          numero: documento.numero,
          fecha: documento.fecha,
          fecha_vence: documento.fecha_vence,
          documento_tipo_id: documento.documento_tipo_id,
          documento_tipo_nombre: documento.documento_tipo_nombre,
          contacto_numero_identificacion:
            documento.contacto_numero_identificacion,
          contacto_nombre_corto: documento.contacto_nombre_corto,
          subtotal: documento.subtotal,
          impuesto: documento.impuesto,
          total: documento.total,
          afectado: documento.afectado,
          saldo: documento.saldo,
        }));
        this.changeDetectorRef.detectChanges();
      });
  }

  obtenerFiltros(arrFiltrosExtra: any) {
    if (arrFiltrosExtra !== null) {
      if (arrFiltrosExtra.length >= 1) {
        this.arrParametrosConsulta.filtros = [
          ...this.filtroPermanente,
          ...arrFiltrosExtra,
        ];
      } else {
        this.arrParametrosConsulta.filtros = this.filtroPermanente;
      }
    }
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

  descargarExcel() {
    this.descargarArchivosService.descargarExcel(
      {
        ...this.arrParametrosConsulta,
        ...{
          limite: 5000,
          excel: true,
        },
      },
      'cartera/informe/pendiente-corte/',
    );
  }

  private _construirFiltros() {
    const filtroGuardado = localStorage.getItem(this.filtroKey);

    if (filtroGuardado) {
      const parametrosConsulta: ParametrosFiltros = {
        ...this.arrParametrosConsulta,
        filtros: [...JSON.parse(filtroGuardado)],
      };

      this.arrParametrosConsulta = parametrosConsulta;
    }
  }
}
