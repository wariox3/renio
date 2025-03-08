import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarHumConcepto } from '@interfaces/comunes/autocompletar/humano/hum-concepto.interface';
import { RegistroHumEntidadLista } from '@interfaces/comunes/autocompletar/humano/hum-entidad.interface';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbDropdownModule, NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { ConceptoService } from './../../servicios/concepto.service';
import { DocumentoDocumentoTipoComponent } from "./components/conceptos-lista/conceptos-lista.component";
import { ProvisionListaComponent } from "./components/provision-lista/provision-lista.component";
import { AporteListaComponent } from "./components/aporte-lista/aporte-lista.component";

@Component({
  selector: 'app-configuracion-humano',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SoloNumerosDirective,
    NgSelectModule,
    NgbDropdownModule,
    NgbNavModule,
    DocumentoDocumentoTipoComponent,
    ProvisionListaComponent,
    AporteListaComponent
],
  templateUrl: './configuracion-humano.component.html',
})
export class ConfiguracionHumanoComponent extends General implements OnInit {
  formularioConfiguracion: FormGroup;
  formularioConcepto: FormGroup;
  arrConceptosNomina: any;
  arrConceptosHumano: RegistroAutocompletarHumConcepto[];
  conceptoSelecionado: any;
  tabActive = 1;
  public listaEntidadesRiesgo: RegistroHumEntidadLista[] = [];

  private readonly _generalService = inject(GeneralService);

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private conceptoService: ConceptoService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.consultarConceptoNomina();
    this._consultarEntidadesRiesgoLista();
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
          hum_entidad_riesgo: respuesta.hum_entidad_riesgo,
        });
      });
  }

  consultarConceptoNomina() {
    this.empresaService.obtenerConceptosNomina().subscribe((respuesta: any) => {
      this.arrConceptosNomina = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

  private _consultarEntidadesRiesgoLista() {
    this._generalService
      .consultarDatosAutoCompletar<RegistroHumEntidadLista>({
        modelo: 'HumEntidad',
        ordenamientos: ['id'],
        filtros: [
          {
            operador: 'exact',
            propiedad: 'riesgo',
            valor1: true,
          },
        ],
      })
      .subscribe({
        next: (response) => {
          this.listaEntidadesRiesgo = response.registros;
          this.changeDetectorRef.detectChanges();
        },
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
    this._generalService
      .consultarDatosAutoCompletar<RegistroAutocompletarHumConcepto>({
        modelo: 'HumConcepto',
        serializador: 'ListaAutocompletar',
      })
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
            this.consultarConceptoNomina();
          })
        )
        .subscribe();
    } else {
      this.formularioConcepto.markAllAsTouched();
    }
  }
}
