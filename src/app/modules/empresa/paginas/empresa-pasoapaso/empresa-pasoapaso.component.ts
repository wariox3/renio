import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { NgbNavConfig, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { EmpresaFormularioComponent } from '../empresa-formulario/empresa-fomrulario.component';
import { EmpresaFacturacionElectronicaComponent } from '../empresa-facturacion-electronica/empresa-facturacion-electronica.component';
import { EmpresaResolucionComponent } from '../empresa-resolucion/empresa-resolucion.component';
import { TranslateModule } from '@ngx-translate/core';
import { General } from '@comun/clases/general';
import { empresaActualizacionAsisteneElectronico } from '@redux/actions/empresa.actions';

@Component({
  selector: 'app-empresa-pasoapaso',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    CardComponent,
    EmpresaFormularioComponent,
    EmpresaFacturacionElectronicaComponent,
    EmpresaResolucionComponent,
    TranslateModule,
  ],
  templateUrl: './empresa-pasoapaso.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgbNavConfig], // add NgbNavConfig to the component providers
})
export class EmpresaPasoapasoComponent extends General {
  navActivo = 1;
  navCompleto: number[] = [];

  constructor(private empresaService: EmpresaService) {
    super();
  }

  navSiguiente(numero: number) {
    this.navActivo = numero;
    this.navCompleto.push(numero);
  }

  continuarPaso(event: any, siguientePaso: number) {
    this.navCompleto.push(this.navActivo);
    this.navActivo = siguientePaso;
  }

  finalizarProceso() {
    this.empresaService.finalizarProceso().subscribe((respuesta) => {
      this.store.dispatch(
        empresaActualizacionAsisteneElectronico({
          asistente_electronico: respuesta.asistente_termiando,
        })
      );
      this.router.navigate(['/general'])
    });
  }
}
