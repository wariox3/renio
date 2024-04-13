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
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';
import { Resolucion } from '@interfaces/general/resolucion';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import ResolucionFormularioComponent from '@modulos/general/componentes/resolucion/resolucion-formulario/resolucion-formulario.component';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { empresaActualizacionRededocIdAction } from '@redux/actions/empresa.actions';
import {
  obtenerEmpresaId,
  obtenerEmpresRededoc_id,
} from '@redux/selectors/empresa.selectors';
import { asyncScheduler, switchMap, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-empresa-facturacion-electronica',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    NgbDropdownModule,
    ResolucionFormularioComponent,
  ],
  templateUrl: './empresa-facturacion-electronica.html',
})
export class EmpresaFacturacionElectronicaComponent
  extends General
  implements OnInit
{
  formularioDian: FormGroup;
  rededoc_id: string;
  empresa_id: string;
  arrResoluciones: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private httpService: HttpService,
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
        ]),
      ],
      resolucion_numero: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z-A-Z-0-9]*$/),
        ]),
      ],
      resolucion_id: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z-A-Z-0-9]*$/),
        ]),
      ],
      correo_facturacion_electronica: [
        null,
        Validators.compose([Validators.required, Validators.email]),
      ],
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
        .activarEmpresa(this.empresa_id, this.formularioDian.value)
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
          })
        )
        .subscribe(() => {});
    } else {
      this.formularioDian.markAllAsTouched();
    }
  }

  consultarResolucion(event: any) {
    let arrFiltros = {
      filtros: [
        {
          id: '1692284537644-1688',
          operador: '__contains',
          propiedad: 'numero__contains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'Resolucion',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrResoluciones = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  abirModal(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  cerrarModal(resolucion: Resolucion): void {
    this.modificarCampoFormulario('resolucion_id', {
      resolucion_id: resolucion.id,
      resolucion_numero: resolucion.numero,
    });
    this.changeDetectorRef.detectChanges();
    this.modalService.dismissAll();
    this.changeDetectorRef.detectChanges();
  }
}
