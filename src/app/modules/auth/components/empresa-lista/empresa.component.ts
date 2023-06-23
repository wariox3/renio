import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { Router } from '@angular/router';
interface Empresa {
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

  arrEmpresas: Empresa[] = [];
lista:string[]=[];


  constructor(
    private router: Router,
    private empresaService: EmpresaService
  ) {

  }

  ngOnInit() {
    this.consultarLista();
    localStorage.setItem('SeleccionarEmpresa', 'false');
  }

  consultarLista() {

    this.empresaService.lista("1")
    .subscribe({
      next:(respuesta)=>{
        this.arrEmpresas = respuesta
      },
      error: ({ error }): void => {
        console.log(error);

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
    window.location.href = `http://${empresaSeleccionada}.muup.online/dashboard`;
  }
}
