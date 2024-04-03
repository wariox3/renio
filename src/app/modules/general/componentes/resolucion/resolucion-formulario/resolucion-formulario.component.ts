import { Component, Input, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { ResolucionService } from '@modulos/general/servicios/resolucion.service';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-resolucion-nuevo',
  standalone: true,
  templateUrl: './resolucion-formulario.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
    BtnAtrasComponent,
    CardComponent,
    NgbModalModule, // necesario para cerrar el modal que está en editarEmpresa
  ],
  providers: [NgbActiveModal],
})
export default class ResolucionFormularioComponent
  extends General
  implements OnInit
{
  formularioResolucion: FormGroup;
  @Input() ocultarBtnAtras = false;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();

  @Input() tituliFijo: Boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private resolucionService: ResolucionService,
    private modalService: NgbModal // necesario para cerrar el modal que está en editarEmpresa
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
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(
      fechaActual.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;

    this.formularioResolucion = this.formBuilder.group({
      prefijo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(10)]),
      ],
      numero: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      consecutivo_desde: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
        ]),
      ],
      consecutivo_hasta: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]*$/),
        ]),
      ],
      fecha_desde: [
        fechaVencimientoInicial,
        Validators.compose([Validators.required]),
      ],
      fecha_hasta: [
        fechaVencimientoInicial,
        Validators.compose([Validators.required]),
      ]
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioResolucion.controls;
  }

  enviarFormulario() {
    if (this.formularioResolucion.valid) {
      if (this.detalle) {
        this.resolucionService
          .actualizarDatos(this.detalle, this.formularioResolucion.value)
          .subscribe((respuesta: any) => {
            this.formularioResolucion.patchValue({
              prefijo: respuesta.prefijo,
              numero: respuesta.numero,
              consecutivo_desde: respuesta.consecutivo_desde,
              consecutivo_hasta: respuesta.consecutivo_hasta,
              fecha_desde: respuesta.fecha_desde,
              fecha_hasta: respuesta.fecha_hasta,
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
          });
      } else {
        this.resolucionService
          .guardarResolucion(this.formularioResolucion.value)
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Se actualizo la información');
            if (this.ocultarBtnAtras) {
              this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
            } else {
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
            }
          });
      }
    } else {
      this.formularioResolucion.markAllAsTouched();
    }
  }

  consultardetalle() {
    this.resolucionService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioResolucion.patchValue({
          prefijo: respuesta.prefijo,
          numero: respuesta.numero,
          consecutivo_desde: respuesta.consecutivo_desde,
          consecutivo_hasta: respuesta.consecutivo_hasta,
          fecha_desde: respuesta.fecha_desde,
          fecha_hasta: respuesta.fecha_hasta,
        });
        this.changeDetectorRef.detectChanges();
      });
  }
}
