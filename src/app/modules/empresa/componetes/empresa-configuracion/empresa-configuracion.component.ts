import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-empresa-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
  ],
  templateUrl: './empresa-configuracion.component.html',
})
export class EmpresaConfiguracionComponent implements OnInit {

  formularioEmpresa: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService
  ) {}

  ngOnInit() {
    this.initForm();
    this.consultarInformacion()
  }

  initForm() {
    this.formularioEmpresa = this.formBuilder.group({
      formato_factura: [''],
    });
  }

  consultarInformacion(){
    this.empresaService.obtenerConfiguracionEmpresa(1).subscribe((respuesta: any) => {
      this.formularioEmpresa.patchValue({
        formato_factura: respuesta.formato_factura
      });
    })
  }

  formSubmit() {
    if (this.formularioEmpresa.valid) {
      this.empresaService
        .configuracionEmpresa(1, this.formularioEmpresa.value)
        .pipe(
          tap((respuestaActualizacion: any) => {
            console.log(respuestaActualizacion);
          })
        )
        .subscribe();
    } else {
      this.formularioEmpresa.markAllAsTouched();
    }
  }
}
