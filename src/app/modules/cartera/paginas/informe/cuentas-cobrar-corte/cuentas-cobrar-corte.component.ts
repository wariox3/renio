import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnExportarComponent } from "@comun/componentes/btn-exportar/btn-exportar.component";
import { CardComponent } from '@comun/componentes/card/card.component';
import { DescargarArchivosService } from '@comun/services/descargar-archivos.service';
import { GeneralService } from '@comun/services/general.service';
import { CUENTAS_COBRAR_CORTE_FILTERS } from '@modulos/cartera/domain/mapeos/cuentas-cobrar-corte.mapeo';
import { CuentasCobrarCorte } from '@modulos/cartera/interfaces/cuentas-cobrar-corte.interface';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { ParametrosApi } from 'src/app/core/interfaces/api.interface';

@Component({
  selector: 'app-cuentas-cobrar-corte',
  standalone: true,
  imports: [CommonModule, CardComponent, TranslateModule, ReactiveFormsModule, BtnExportarComponent],
  templateUrl: './cuentas-cobrar-corte.component.html',
})
export class CuentasCobrarCorteComponent extends General implements OnInit {
  private _generalService = inject(GeneralService);
  private _formBuilder = inject(FormBuilder);

  public formularioFiltros: FormGroup;
  public cargandoCuentas = signal(false);
  public cuentas = signal<CuentasCobrarCorte[]>([]);

  CAMPOS_FILTRO = CUENTAS_COBRAR_CORTE_FILTERS;
  filtros: ParametrosApi = {};
  cantidadRegistros = signal<number>(0);
  queryParams: ParametrosApi = {
    limit: 50,
    serializador: 'Informe',
  };

  public filtroKey = 'cartera_cuentascobrarcorte';

  constructor(private descargarArchivosService: DescargarArchivosService) {
    super();
  }

  ngOnInit(): void {
    this._initFormularioFiltros();
  }

  private _initFormularioFiltros() {
    const currentDate = new Date();

    const hoy = currentDate.toISOString().split('T')[0];

    this.formularioFiltros = this._formBuilder.group({
      fecha: [hoy, Validators.required],
    });
  }

  consultarLista(queryParams: ParametrosApi = {}) {
    this.cargandoCuentas.set(true);
    this._generalService
      .consultaApi<{
        registros: CuentasCobrarCorte[];
        cantidad_registros: number;
      }>('cartera/informe/pendiente-corte/', {
        ...queryParams,
      })
      .pipe(finalize(() => this.cargandoCuentas.set(false)))
      .subscribe((respuesta) => {
        this.cantidadRegistros.set(respuesta.cantidad_registros);
        this.cuentas.set(respuesta.registros);
      });
  }

  descargarExcel() {
    this.descargarArchivosService.exportarExcelPersonalizado(
      'cartera/informe/pendiente-corte',
      {
        fecha: this.formularioFiltros.value.fecha,
        excel: 'True',
      },
    );
  }

  generar() {
    this.consultarLista(this.formularioFiltros.value);
  }
}
