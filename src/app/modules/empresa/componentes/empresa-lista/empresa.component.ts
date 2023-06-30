import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmpresaService } from '../../servicios/empresa.service';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { AlertaService } from '@comun/services/alerta.service';
import { Empresa } from '@interfaces/usuario/empresa';

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
    private alertaMensaje: AlertaService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    localStorage.setItem('SeleccionarEmpresa', 'false');
    this.consultarLista();
  }

  consultarLista() {
    this.store.select(obtenerId)
    .pipe(
      switchMap(([usuarioId])=>this.empresaService.lista(usuarioId))
    ).subscribe({
      next:(respuesta) => {
        this.arrEmpresas = respuesta;
        this.changeDetectorRef.detectChanges();
      },
      error: ({ error }): void => {
        this.alertaMensaje.mensajeError(
          'Error consulta',
          `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
        );
      },
    })
  }

  seleccionarEmpresa(empresaSeleccionada: string) {
    localStorage.setItem('SeleccionarEmpresa', 'true');
    const empresa = {
      nombre: 'demo',
      logo: 'https://es.expensereduction.com/wp-content/uploads/2018/02/logo-placeholder.png',
    };
    window.location.href = `http://${empresaSeleccionada}.muup.online`;
  }
}
