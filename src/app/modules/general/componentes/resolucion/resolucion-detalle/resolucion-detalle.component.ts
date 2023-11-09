import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { ResolucionService } from '@modulos/general/servicios/resolucion.service';

@Component({
  selector: 'app-resolucion-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
  ],
  templateUrl: './resolucion-detalle.component.html',
  styleUrls: ['./resolucion-detalle.component.scss']
})
export default class ResolucionNuevoComponent extends General implements OnInit {
  formularioResolucion: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private resolucionService: ResolucionService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();

    if (this.detalle) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    this.formularioResolucion = this.formBuilder.group({
      prefijo: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      numero: [
        '',
        Validators.compose([
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      consecutivo_desde: [
        null,
        Validators.compose([
          Validators.pattern(/^[0-9]*$/),
        ]),
      ],
      consecutivo_hasta: [
        null,
        Validators.compose([
          Validators.pattern(/^[0-9]*$/),
        ]),
      ],
      fecha_desde: [
        null
      ],
      fecha_hasta: [
        null
      ],
    })

  }

  get obtenerFormularioCampos() {
    return this.formularioResolucion.controls;
  }

  enviarFormulario(){
    if(this.detalle){
      this.resolucionService.actualizarDatos(this.detalle, this.formularioResolucion.value)
      .subscribe((respuesta: any)=>{
        this.formularioResolucion.patchValue({
          prefijo: respuesta.prefijo,
          numero: respuesta.numero,
          consecutivo_desde: respuesta.consecutivo_desde,
          consecutivo_hasta: respuesta.consecutivo_hasta,
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
        });
        this.alertaService.mensajaExitoso('Se actualizo la información');
      })
    } else {
      this.resolucionService.guardarResolucion(this.formularioResolucion.value)
      .subscribe((respuesta:any) => {
        this.alertaService.mensajaExitoso('Se actualizo la información');
        this.router.navigate(['/detalle'], {
          queryParams: {
            modelo: this.activatedRoute.snapshot.queryParams['modelo'],
            tipo: this.activatedRoute.snapshot.queryParams['tipo'],
            formulario: `${this.activatedRoute.snapshot.queryParams['formulario']}`,
            detalle: respuesta.id,
            accion: 'detalle',
          },
        });
      })

    }
  }


  consultardetalle(){
    this.resolucionService.consultarDetalle(this.detalle)
    .subscribe((respuesta: any)=>{
      this.formularioResolucion.patchValue({
        prefijo: respuesta.prefijo,
        numero: respuesta.numero,
        consecutivo_desde: respuesta.consecutivo_desde,
        consecutivo_hasta: respuesta.consecutivo_hasta,
        fecha_desde: respuesta.fecha_desde,
        fecha_hasta: respuesta.fecha_hasta,
      })
      this.changeDetectorRef.detectChanges();

    })
  }
}
