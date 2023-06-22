import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { Router } from '@angular/router';

export interface PeriodicElement {
  id: number;
  usuario_id: number;
  empresa_id: number;
  empresa: string;
}

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss'],
})
export class EmpresaComponent implements OnInit {

  arrEmpresas: any[] = [];


  constructor(
    private router: Router,
    private empresaService: EmpresaService
  ) {
    this.consultarLista();

  }

  ngOnInit() {
    localStorage.setItem('SeleccionarEmpresa', 'false');
  }

  consultarLista() {
    console.log("consultar empresas");
    this.empresaService.lista("1")
    .subscribe({
      next:(respuesta: any)=>{
        this.arrEmpresas = respuesta
      },
      error: ({ error }): void => {
        // this.swalService.mensajeError(
        //   'Error consulta',
        //   `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
        // );
      },
    })
  }

  seleccionarEmpresa(empresaSeleccionada: string) {
    localStorage.setItem('SeleccionarEmpresa', 'true');
    const empresa = {
      nombre: 'demo',
      logo: 'https://es.expensereduction.com/wp-content/uploads/2018/02/logo-placeholder.png',
    };
    window.location.href = `http://${empresaSeleccionada}.muup.online/inicio`;
  }
}
