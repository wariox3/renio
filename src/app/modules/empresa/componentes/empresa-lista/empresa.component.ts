import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmpresaService } from '../../servicios/empresa.service';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { AlertaService } from '@comun/services/alerta.service';
import { Empresa } from '@interfaces/usuario/empresa';
import {
  empresaActionInit,
  empresaSeleccionAction,
} from '@redux/actions/empresa.actions';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss'],
})
export class EmpresaComponent implements OnInit {
  arrEmpresas: Empresa[] = [];

  constructor(
    private router: Router,
    private store: Store,
    private empresaService: EmpresaService,
    private alertaService: AlertaService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.consultarLista();
  }

  consultarLista() {
    this.store
      .select(obtenerId)
      .pipe(switchMap((usuarioId) => this.empresaService.lista(usuarioId)))
      .subscribe({
        next: (respuesta) => {
          this.arrEmpresas = respuesta;
          this.changeDetectorRef.detectChanges();
        },
        error: ({ error }): void => {
          this.alertaService.mensajeError(
            'Error consulta',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          );
        },
      });
  }

  seleccionarEmpresa(empresaSeleccionada: Number) {
    this.empresaService
      .detalle(`${empresaSeleccionada}`)
      .subscribe((respuesta) => {
        const empresa: Empresa = {
          nombre: respuesta.nombre,
          imagen:
            'https://es.expensereduction.com/wp-content/uploads/2018/02/logo-placeholder.png',
          empresa_id: 1,
          subdominio: respuesta.subdominio,
          id: 1,
          usuario_id: 1,
          seleccion: true,
          rol: respuesta.rol,
        };
        this.store.dispatch(empresaActionInit({ empresa }));
      });
  }

  eliminarEmpresa(empresa_id: Number) {
    this.alertaService
      .mensajeValidacion(
        'Eliminar usuario',
        'Este proceso no tiene reversa',
        'warning'
      )
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.empresaService.eliminarEmpresa(empresa_id).subscribe();
        }
      });
  }
}
