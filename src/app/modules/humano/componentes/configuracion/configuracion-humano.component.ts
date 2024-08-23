import { ConceptoService } from './../../servicios/concepto.service';
import { HttpService } from '@comun/services/http.service';
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
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import {
  AutocompletarRegistros,
  RegistroAutocompletarConcepto,
} from '@interfaces/comunes/autocompletar';

@Component({
  selector: 'app-configuracion-humano',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SoloNumerosDirective,
    CardComponent,
  ],
  templateUrl: './configuracion-humano.component.html',
})
export class ConfiguracionHumanoComponent extends General implements OnInit {
  formularioConfiguracion: FormGroup;
  formularioConcepto: FormGroup;
  arrConceptosNomina: any;
  arrConceptosHumano: RegistroAutocompletarConcepto[];
  conceptoSelecionado: any;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private conceptoService: ConceptoService,
    private modalService: NgbModal,
    private httpService: HttpService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.consultarConceptoNomina();
    this.initForm();
  }

  initForm() {
    this.formularioConfiguracion = this.formBuilder.group({
      hum_factor: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(6),
          Validators.pattern(/^[0-9.,]+$/),
        ]),
      ],
      hum_salario_minimo: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20)]),
      ],
      hum_auxilio_transporte: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(20)]),
      ],
    });
  }

  consultarInformacion() {
    this.empresaService
      .obtenerConfiguracionEmpresa(1)
      .subscribe((respuesta: any) => {
        this.formularioConfiguracion.patchValue({
          hum_factor: respuesta.hum_factor,
          hum_salario_minimo: parseInt(respuesta.hum_salario_minimo),
          hum_auxilio_transporte: parseInt(respuesta.hum_auxilio_transporte),
        });
      });
  }

  consultarConceptoNomina() {
    this.empresaService.obtenerConceptosNomina().subscribe((respuesta: any) => {
      this.arrConceptosNomina = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

  formSubmit() {
    if (this.formularioConfiguracion.valid) {
      this.empresaService
        .configuracionEmpresa(1, this.formularioConfiguracion.value)
        .pipe(
          tap((respuestaActualizacion: any) => {
            if (respuestaActualizacion.actualizacion) {
              this.alertaService.mensajaExitoso(
                this.translateService.instant(
                  'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
                )
              );
            }
          })
        )
        .subscribe();
    } else {
      this.formularioConfiguracion.markAllAsTouched();
    }
  }

  abrirModal(content: any, conceptoNomina: any) {
    this.conceptoSelecionado = conceptoNomina;
    this.changeDetectorRef.detectChanges();
    this.httpService
      .post<AutocompletarRegistros<RegistroAutocompletarConcepto>>(
        'general/funcionalidad/autocompletar/',
        {
          filtros: [
            {
              operador: '__icontains',
              propiedad: 'nombre__icontains',
              valor1: '',
              valor2: '',
            },
          ],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'HumConcepto',
        }
      )
      .subscribe((respuesta) => {
        this.iniciarFormularioConcepto();
        this.formularioConcepto.patchValue({
          id: this.conceptoSelecionado.id,
          nombre: this.conceptoSelecionado.nombre,
        });
        this.arrConceptosHumano = respuesta.registros;
        this.modalService.open(content, {
          ariaLabelledBy: 'modal-basic-title',
          size: 'lg',
        });
      });

    this.changeDetectorRef.detectChanges();
  }

  iniciarFormularioConcepto() {
    this.formularioConcepto = this.formBuilder.group({
      id: ['', Validators.compose([Validators.required])],
      concepto: ['', Validators.compose([Validators.required])],
      nombre: ['', Validators.compose([Validators.required])],
    });
  }

  enviarFormulario() {
    if (this.formularioConcepto.valid) {
      this.conceptoService
        .actualizarConceptoNomina(
          this.conceptoSelecionado.id,
          this.formularioConcepto.value
        )
        .pipe(
          tap((respuestaActualizacion: any) => {
            this.modalService.dismissAll();
            this.alertaService.mensajaExitoso(
              this.translateService.instant(
                'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
              )
            );
            this.consultarConceptoNomina()
          })
        )
        .subscribe();
    } else {
      this.formularioConcepto.markAllAsTouched();
    }
  }
}
