import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { FechasService } from '@comun/services/fechas.service';
import { GeneralService } from '@comun/services/general.service';
import { HttpService } from '@comun/services/http.service';
import {
  MotivoTerminacion,
  ProgramacionContrato,
} from '@modulos/humano/interfaces/contrato.interface';
import { ContratoService } from '@modulos/humano/servicios/contrato.service';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contrato-detalle',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    BtnAtrasComponent,
    TranslateModule,
    ReactiveFormsModule,
    TituloAccionComponent,
    NgbDropdownModule,
    NgSelectModule,
  ],
  templateUrl: './contrato-detalle.component.html',
  styleUrls: ['./contrato-detalle.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContratoDetalleComponent
  extends General
  implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _modalService = inject(NgbModal);
  private _httpService = inject(HttpService);
  private _fechasService = inject(FechasService);
  private _generalService = inject(GeneralService);

  public formularioTerminar: FormGroup;
  public tituloModal: string = '';
  public formularioParametrosIniciales: FormGroup;
  public motivosTerminacion = signal<any[]>([]);

  constructor(private contratoService: ContratoService) {
    super();
  }

  contrato: ProgramacionContrato = {
    id: 1,
    fecha_desde: new Date(),
    fecha_hasta: new Date(),
    salario: 0,
    auxilio_transporte: false,
    salario_integral: false,
    estado_terminado: false,
    comentario: '',
    contrato_tipo_id: 0,
    contrato_tipo_nombre: '',
    grupo_id: 0,
    grupo_nombre: '',
    contacto_id: 0,
    contacto_numero_identificacion: '',
    contacto_nombre_corto: '',
    sucursal_id: 0,
    sucursal_nombre: '',
    riesgo_id: 0,
    riesgo_nombre: '',
    cargo_id: 0,
    cargo_nombre: '',
    tipo_cotizante_id: 0,
    tipo_cotizante_nombre: '',
    subtipo_cotizante_id: 0,
    subtipo_cotizante_nombre: '',
    salud_id: 0,
    salud_nombre: '',
    pension_id: 0,
    pension_nombre: '',
    ciudad_contrato: 0,
    ciudad_contrato_nombre: '',
    ciudad_labora: 0,
    ciudad_labora_nombre: '',
    entidad_caja_id: 0,
    entidad_caja_nombre: '',
    entidad_cesantias_id: 0,
    entidad_cesantias_nombre: '',
    entidad_pension_id: 0,
    entidad_pension_nombre: '',
    entidad_salud_id: 0,
    fecha_ultimo_pago_vacacion: '',
    entidad_salud_nombre: '',
    fecha_ultimo_pago: null,
    fecha_ultimo_pago_prima: null,
    fecha_ultimo_pago_cesantia: null,
    tiempo_id: 0,
    tiempo_nombre: null,
    tipo_costo_id: 0,
    tipo_costo_nombre: '',
    grupo_contabilidad_nombre: '',
  };

  ngOnInit() {
    this.consultardetalle();
    this._initForm();
  }

  private _initForm() {
    this.formularioTerminar = this._formBuilder.group({
      id: [this.detalle],
      fecha_terminacion: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      motivo_terminacion_id: [null, Validators.compose([Validators.required])],
    });
  }

  private _initFormularioParametrosIniciales() {
    const fechaActual = this._fechasService.obtenerFechaActualFormateada();
    this.formularioParametrosIniciales = this._formBuilder.group({
      id: [this.contrato.id],
      fecha_ultimo_pago: [fechaActual],
      fecha_ultimo_pago_prima: [fechaActual],
      fecha_ultimo_pago_cesantia: [fechaActual],
      fecha_ultimo_pago_vacacion: [fechaActual],
    });
  }

  private _consultarListaGeneral() {
    this._generalService.consultaApi<{
      contrato_id: number;
      fecha_ultimo_pago: string;
      fecha_ultimo_pago_prima: string;
      fecha_ultimo_pago_cesantia: string;
      fecha_ultimo_pago_vacacion: string;
    }>(
      'humano/contrato/',
      {
        limit: 50,
        serializador: 'parametros_iniciales',
        id: this.contrato.id,
      },
    ).subscribe((response: any) => {
      const fechaActual = this._fechasService.obtenerFechaActualFormateada();
      this.formularioParametrosIniciales.patchValue({
        fecha_ultimo_pago:
          response.results[0].fecha_ultimo_pago || fechaActual,
        fecha_ultimo_pago_prima:
          response.results?.[0].fecha_ultimo_pago_prima || fechaActual,
        fecha_ultimo_pago_cesantia:
          response.results?.[0].fecha_ultimo_pago_cesantia || fechaActual,
        fecha_ultimo_pago_vacacion:
          response.results?.[0].fecha_ultimo_pago_vacacion || fechaActual,
      });
    })
  }

  abrirModal(content: any) {
    this.tituloModal = 'Terminar contrato';
    this._consultarMotivosTerminacion();
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
    });
  }

  private _consultarMotivosTerminacion() {
    this.contratoService.consultarMotivosTerminacion().subscribe((response) => {
      this.motivosTerminacion.set(response.results);
    });
  }

  evniarFormularioTerminar() {
    if (this.formularioTerminar.valid) {
      this._httpService
        .post('humano/contrato/terminar/', this.formularioTerminar.value)
        .subscribe(() => {
          this.consultardetalle();
          this._modalService.dismissAll();
          this.alertaService.mensajaExitoso('Contrato terminado!');
        });
    }
  }

  consultardetalle() {
    this.contratoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.contrato = respuesta;

        this.formularioTerminar.patchValue({
          fecha_terminacion: this.contrato.fecha_hasta,
        });
        this._initFormularioParametrosIniciales();
        this.changeDetectorRef.detectChanges();
      });
  }

  abrirModalParametrosIniciales(content: any) {
    this._consultarListaGeneral();
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  enviarFormulario() {
    this.contratoService
      .guardarParametrosIniciales(this.formularioParametrosIniciales.value)
      .subscribe((response) => {
        this._modalService.dismissAll();
        this.consultardetalle();
        this.alertaService.mensajaExitoso('Parametros iniciales actualizados!');
      });
  }

  seleccionarMotivoTerminacion(event: MotivoTerminacion) {
    this.formularioTerminar.patchValue({
      motivo_terminacion: event.id,
    });
  }

  cerfiticadoLAboral() {
    this._httpService.descargarArchivo(
      'humano/contrato/imprimir-certificado-laboral/',
      {
        id: this.detalle,
      },
    );
  }
}
