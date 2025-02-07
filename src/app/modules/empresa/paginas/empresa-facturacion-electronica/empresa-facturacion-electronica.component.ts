import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { InputValueCaseDirective } from '@comun/directive/input-value-case.directive';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { empresaActualizacionRededocIdAction } from '@redux/actions/empresa.actions';
import {
  obtenerEmpresaId,
  obtenerEmpresRededoc_id,
} from '@redux/selectors/empresa.selectors';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-empresa-facturacion-electronica',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    NgbModalModule,
    InputValueCaseDirective
  ],
  templateUrl: './empresa-facturacion-electronica.html',
})
export class EmpresaFacturacionElectronicaComponent
  extends General
  implements OnInit
{
  formularioDian: FormGroup;
  formularioDianEditar: FormGroup;
  rededoc_id: string;
  empresa_id: string;
  arrResoluciones: any[] = [];
  @Input() visualizarBtnSiguiente = true;
  @Output() emitirRegistroGuardado: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit() {
    this.initFormDian();
    this.store
      .select(obtenerEmpresaId)
      .subscribe((id) => (this.empresa_id = id));
    this.store
      .select(obtenerEmpresRededoc_id)
      .subscribe((rededoc_id) => (this.rededoc_id = rededoc_id));
  }

  initFormDian() {
    this.formularioDian = this.formBuilder.group({
      set_pruebas: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z-A-Z-0-9]*$/),
          Validators.maxLength(36),
        ]),
      ],
      correo_facturacion_electronica: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      copia_correo_facturacion_electronica: [false],
    });
  }

  inicializFormularioDianEditar() {
    this.formularioDianEditar = this.formBuilder.group({
      correo_facturacion_electronica: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
      copia_correo_facturacion_electronica: [false],
    });
  }

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'resolucion_id') {
      this.formularioDian.get(campo)?.setValue(dato.resolucion_id);
      this.formularioDian
        .get('resolucion_numero')
        ?.setValue(dato.resolucion_numero);
    }
    this.changeDetectorRef.detectChanges();
  }

  activarEmpresa() {
    if (this.formularioDian.valid) {
      this.empresaService
        .reddocActivar(this.empresa_id, this.formularioDian.value)
        .pipe(
          switchMap(() =>
            this.empresaService.consultarDetalle(this.empresa_id)
          ),
          tap((respuestaConsultaEmpresa: any) => {
            this.store.dispatch(
              empresaActualizacionRededocIdAction({
                rededoc_id: respuestaConsultaEmpresa.rededoc_id,
              })
            );
            this.changeDetectorRef.detectChanges();
            return this.emitirRegistroGuardado.emit(true);
          })
        )
        .subscribe(() => {});
    } else {
      this.formularioDian.markAllAsTouched();
    }
  }

  abirModalEditar(content: any) {
    this.inicializFormularioDianEditar();
    this.consultarInformacion();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  consultarInformacion() {
    this.empresaService
      .reddocDetalle(this.empresa_id)
      .subscribe((respuesta: any) => {
        this.formularioDianEditar.patchValue({
          correo_facturacion_electronica:
            respuesta.cuenta.correoFacturacionElectronica,
          copia_correo_facturacion_electronica:
            respuesta.cuenta.copiaCorreoFacturacionElectronica,
        });
      });
  }

  editarEmpresa() {
    if (this.formularioDianEditar.valid) {
      this.empresaService
        .reddocActualizar(this.empresa_id, this.formularioDianEditar.value)
        .subscribe((respuesta) => {
          this.alertaService.mensajaExitoso(
            this.translateService.instant(
              'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
            )
          );
          this.modalService.dismissAll();
        });
    } else {
      this.formularioDianEditar.markAsTouched;
    }
  }

  emitirRegistro() {
    return this.emitirRegistroGuardado.emit(true);
  }
}
