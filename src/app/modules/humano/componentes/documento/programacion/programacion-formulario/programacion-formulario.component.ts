import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { ContratoService } from '@modulos/humano/servicios/contrato.service';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';

@Component({
  selector: 'app-programacion-formulario',
  standalone: true,
  imports: [
    CommonModule,
    BtnAtrasComponent,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    TranslateModule,
    NgbDropdownModule,
    BuscarAvanzadoComponent,
],
  templateUrl: './programacion-formulario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContratoFormularioComponent
  extends General
  implements OnInit
{
  formularioProgramacion: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private contratoService: ContratoService
  ) {
    super();
  }

  arrPagoTipo: any[];
  arrGrupo: any[];

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();
    this.changeDetectorRef.detectChanges();
  }

  iniciarFormulario() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const primerDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const ultimoDiaMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
  
    const fechaDesde = `${primerDiaMes.getFullYear()}-${(primerDiaMes.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${primerDiaMes.getDate().toString().padStart(2, '0')}`;

    this.formularioProgramacion = this.formBuilder.group({
      fecha_desde: [
        fechaDesde,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      fecha_hasta: [
        fechaDesde,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      pago_tipo: ['', Validators.compose([Validators.required])],
      grupo: ['', Validators.compose([Validators.required])],
    });
  }

  consultarInformacion() {
    zip(
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
              operador: '__icontains',
              propiedad: 'nombre__icontains',
              valor1: ``,
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'HumPagoTipo',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
              operador: '__icontains',
              propiedad: 'nombre__icontains',
              valor1: ``,
              valor2: '',
            },
          ],
          limite: 0,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'HumGrupo',
        }
      ),
    ).subscribe((respuesta: any) => {
      this.arrPagoTipo = respuesta[0].registros;
      this.arrGrupo = respuesta[1].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  enviarFormulario(){

  }

}
