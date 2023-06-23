import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmpresaService } from '../../services/empresa.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
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

  constructor(
    private router: Router,
    private empresaService: EmpresaService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    localStorage.setItem('SeleccionarEmpresa', 'false');
    this.consultarLista();
  }

  consultarLista() {
    this.empresaService.lista("1")
      .subscribe((respuesta) => {
        this.arrEmpresas = respuesta;
        this.changeDetectorRef.detectChanges();
      });
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
