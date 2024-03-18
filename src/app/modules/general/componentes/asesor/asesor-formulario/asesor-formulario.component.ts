import { CommonModule, } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { AsesorService } from '@modulos/general/servicios/asesor.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-asesor-formulario',
  standalone: true,
  templateUrl: './asesor-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    BtnAtrasComponent,
    CardComponent
  ]
})
export default class AsesorFormularioComponent extends General implements OnInit  { 
  formularioAsesor: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private asesorService: AsesorService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();

    if (this.detalle) {
      this.consultarDetalle();
    }
  }

  iniciarFormulario() {
    this.formularioAsesor =  this.formBuilder.group({
      nombre_corto: [null, Validators.compose([Validators.required])],
      celular: [null, Validators.compose([Validators.required, Validators.maxLength(50)])],
      correo: [null, Validators.compose([Validators.email, Validators.maxLength(255), Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)])]
    })
  }

  get obtenerFormularioCampos() {
    return this.formularioAsesor.controls;
  }

  enviarFormulario() {
    if (this.formularioAsesor.valid) {
      if(this.detalle){
        this.asesorService.actualizarDatos(this.detalle, this.formularioAsesor.value)
        .subscribe((respuesta: any)=>{
          this.formularioAsesor.patchValue({
            nombre_corto: respuesta.nombre_corto,
            celular: respuesta.celular,
            correo: respuesta.correo,
          });
          this.alertaService.mensajaExitoso('Se actualizo la información');
          this.router.navigate(['/detalle'], {
            queryParams: {
              modulo: this.activatedRoute.snapshot.queryParams['modulo'],
              modelo: this.activatedRoute.snapshot.queryParams['modelo'],
              tipo: this.activatedRoute.snapshot.queryParams['tipo'],
              formulario: `${this.activatedRoute.snapshot.queryParams['formulario']}`,
              detalle: respuesta.id,
              accion: 'detalle',
            },
          });
        })
      } else {
        this.asesorService.guardarAsesor(this.formularioAsesor.value)
        .subscribe((respuesta:any) => {
          this.alertaService.mensajaExitoso('Se actualizo la información');
          this.router.navigate(['/detalle'], {
            queryParams: {
              modulo: this.activatedRoute.snapshot.queryParams['modulo'],
              modelo: this.activatedRoute.snapshot.queryParams['modelo'],
              tipo: this.activatedRoute.snapshot.queryParams['tipo'],
              formulario: `${this.activatedRoute.snapshot.queryParams['formulario']}`,
              detalle: respuesta.id,
              accion: 'detalle',
            },
          });
        })
  
      }
    } else {
      this.formularioAsesor.markAllAsTouched();

    }
  }

  consultarDetalle() {
    this.asesorService
    .consultarDetalle(this.detalle)
    .subscribe((respuesta: any) => {
      this.formularioAsesor.patchValue({
        nombre_corto: respuesta.nombre_corto,
        celular: respuesta.celular,
        correo: respuesta.correo,
      });

      this.changeDetectorRef.detectChanges();
    });
  }

}
