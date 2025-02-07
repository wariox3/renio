import { inject, Injectable, signal } from '@angular/core';
import { GeneralService } from '@comun/services/general.service';
import { MapaDatos } from '@comun/type/mapeo-data.type';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { ProgramacionContratos } from '@modulos/humano/interfaces/programacion-contratos.interface';
import { RespuestaProgramacionContrato } from '@modulos/humano/interfaces/respuesta-programacion-contratos.interface';
import { Store } from '@ngrx/store';
import { ActualizarMapeo } from '@redux/actions/menu.actions';
import { tap } from 'rxjs';
import { FiltrosDetalleProgramacionContratos } from '../../../constantes';

@Injectable({
  providedIn: 'root',
})
export class TablaContratosService {
  private readonly _generalService = inject(GeneralService);
  private readonly _store = inject(Store);

  public arrProgramacionDetalle = signal<RespuestaProgramacionContrato[]>([]);
  public cantidadRegistros = signal(0);
  public ordernamientoValor = signal('');
  public registrosAEliminar = signal<number[]>([]);
  public isCheckedSeleccionarTodos = signal(false);


  public consultarListaContratos(parametrosConsulta: ParametrosFiltros) {
    this.reiniciarSelectoresEliminar();
    return this._generalService
      .consultarDatosLista<ProgramacionContratos>(parametrosConsulta)
      .pipe(
        tap((respuesta) => {
          this._actualizarMapeo(FiltrosDetalleProgramacionContratos);
          this.cantidadRegistros.update(() => respuesta.cantidad_registros);
          this.arrProgramacionDetalle.set(
            respuesta.registros.map(
              (registro: RespuestaProgramacionContrato) => ({
                ...registro,
                selected: false,
              })
            )
          );
        })
      );
  }

  public ordenarPor(nombre: string) {
    if (this.ordernamientoValor().charAt(0) == '-') {
      this.ordernamientoValor.set(nombre.toLowerCase());
    } else {
      this.ordernamientoValor.set(`-${nombre.toLowerCase()}`);
    }
  }

  public toggleAllSelectoresEliminar(estaChecked: boolean) {
    this.isCheckedSeleccionarTodos.update((checked) => (checked = !checked));
    let registros = this.arrProgramacionDetalle();
    if (estaChecked) {
      registros.map((item: RespuestaProgramacionContrato) => {
        item.selected = true;
        const index = this.registrosAEliminar().indexOf(item.id);
        if (index === -1) {
          let registros = this.registrosAEliminar();
          this.registrosAEliminar.set([...registros, item.id]);
        }
      });
      this.arrProgramacionDetalle.set(registros);
    } else {
      registros.map((item: RespuestaProgramacionContrato) => {
        item.selected = false;
      });
      this.arrProgramacionDetalle.set(registros);
      this.registrosAEliminar.set([]);
    }
  }

  public agregarRegistrosEliminar(id: number) {
    let registros = this.registrosAEliminar();
    let index = registros.indexOf(id);
    let contratos = this.arrProgramacionDetalle();
    contratos.find((contrato: RespuestaProgramacionContrato) => {
      if (contrato.id === id) {
        contrato.selected = !contrato.selected;
      }
    });
    this.arrProgramacionDetalle.set(contratos);
    if (index !== -1) {
      const updatedRegistros = [...registros];
      updatedRegistros.splice(index, 1);
      this.registrosAEliminar.set(updatedRegistros);
    } else {
      this.registrosAEliminar.set([...registros, id]);
    }
  }

  public reiniciarSelectoresEliminar() {
    this.isCheckedSeleccionarTodos.set(false);
    this.registrosAEliminar.set([]);
    this.isCheckedSeleccionarTodos.set(false);
  }

  private _actualizarMapeo(mapaDatos: MapaDatos[]) {
    this._store.dispatch(ActualizarMapeo({ dataMapeo: mapaDatos }));
  }
}
