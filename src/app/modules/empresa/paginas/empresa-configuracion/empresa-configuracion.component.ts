import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { EmpresaFacturacionElectronicaComponent } from '../empresa-facturacion-electronica/empresa-facturacion-electronica.component';

@Component({
  selector: 'app-empresa-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    TranslateModule,
    EmpresaFacturacionElectronicaComponent
  ],
  templateUrl: './empresa-configuracion.component.html',
})

export class EmpresaConfiguracionComponent {

}
