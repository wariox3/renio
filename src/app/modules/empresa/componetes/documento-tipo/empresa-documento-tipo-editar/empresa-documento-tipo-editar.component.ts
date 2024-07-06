import { HttpService } from '@comun/services/http.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { BtnAtrasComponent } from '../../../../../comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '../../../../../comun/componentes/card/card.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { zip } from 'rxjs';
import { Resolucion } from '@interfaces/general/resolucion';

@Component({
  selector: 'app-empresa-documento-tipo-editar',
  templateUrl: './empresa-documento-tipo-editar.component.html',
  standalone: true,
  imports: [
    BtnAtrasComponent,
    CardComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
  ],
})
export class EmpresaDocumentoTipoEditarComponent
  extends General
  implements OnInit
{
  formularioDocumentoTipo: FormGroup;
  arrResoluciones: any[] = []
  @Input() ocultarBtnAtras: Boolean = false;
  @Input() tipoRolucion: 'compra' | 'venta' | null = null;
  @Input() tituloFijo: Boolean = false;
  @Input() editarInformacion: Boolean = false;
  @Input() idEditarInformacion: number | null = null;
  @Output() emitirGuardoRegistro: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private HttpService: HttpService
  ) {
    super();
  }

  ngOnInit() {
    this.iniciarFormulario();
    if (this.detalle || this.editarInformacion) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    this.formularioDocumentoTipo = this.formBuilder.group({
      consecutivo: ['', Validators.compose([Validators.required])],
      resolucion: [''],
    });
  }

  enviarFormulario() {
    if (this.formularioDocumentoTipo.valid) {
      let tipoResolucion: any = {};
      tipoResolucion[this.parametrosUrl.parametro] = true;

      if (this.tipoRolucion != null) {
        tipoResolucion[this.tipoRolucion] = true;
      }

      if (this.detalle || this.idEditarInformacion) {
        let resolucionId = this.detalle;

        if (this.idEditarInformacion !== null) {
          resolucionId = this.idEditarInformacion;
        }

        this.empresaService
          .actualizarDocumentoTipo(resolucionId, {
            ...this.formularioDocumentoTipo.value,
            ...tipoResolucion,
          })
          .subscribe((respuesta: any) => {
            this.formularioDocumentoTipo.patchValue({
              consecutivo: respuesta.consecutivo,
              resolucion: respuesta.resolucion,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            if (this.ocultarBtnAtras) {
              this.emitirGuardoRegistro.emit(respuesta); // necesario para cerrar el modal que está en editarEmpresa
            } else {
              this.router.navigate(['/administrador/detalle'], {
                queryParams: {
                  modulo: this.activatedRoute.snapshot.queryParams['modulo'],
                  modelo: this.activatedRoute.snapshot.queryParams['modelo'],
                  tipo: this.activatedRoute.snapshot.queryParams['tipo'],
                  formulario: `${this.activatedRoute.snapshot.queryParams['formulario']}`,
                  detalle: respuesta.id,
                  accion: 'detalle',
                  parametro:
                    this.activatedRoute.snapshot.queryParams['parametro'],
                },
              });
            }
          });
      }
    } else {
      this.formularioDocumentoTipo.markAllAsTouched();
    }
  }

  consultardetalle() {
    let resolucionId = this.detalle;

    if (this.idEditarInformacion !== null) {
      resolucionId = this.idEditarInformacion;
    }

    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'numero__icontains',
          valor1: ``,
          valor2: '',
        },
        {
          propiedad: 'venta',
          valor1: true,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'Resolucion',
    };

    zip(
      this.HttpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        arrFiltros
      ),
      this.empresaService
      .consultarDocumentoTipoDetalle(resolucionId),

    ).subscribe((respuesta: any) => {
        this.arrResoluciones = respuesta[0].registros
        this.formularioDocumentoTipo.patchValue({
          consecutivo: respuesta[1].consecutivo,
          resolucion: respuesta[1].resolucion_id,
        });
        this.changeDetectorRef.detectChanges();
      });
  }


}
