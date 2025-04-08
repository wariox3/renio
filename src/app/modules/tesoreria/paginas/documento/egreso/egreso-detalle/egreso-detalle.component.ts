import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BaseEstadosComponent } from '@comun/componentes/base-estados/base-estados.component';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { HttpService } from '@comun/services/http.service';

import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, switchMap, tap } from 'rxjs';
import { DocumentoOpcionesComponent } from "../../../../../../comun/componentes/documento-opciones/documento-opciones.component";

@Component({
  selector: 'app-egreso-detalle',
  standalone: true,
  imports: [
    CommonModule,
    BtnAtrasComponent,
    CardComponent,
    TranslateModule,
    NgbNavModule,
    NgSelectModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    BaseEstadosComponent,
    TituloAccionComponent,
    DocumentoOpcionesComponent
],
  templateUrl: './egreso-detalle.component.html',
})
export default class EgresoDetalleComponent extends General implements OnInit {
  public formularioGenerarArchivoPlano: FormGroup;
  private _formBuilder = inject(FormBuilder);

  public tituloModal: string = '';
  pago: any = {
    contacto_id: '',
    descuento: '',
    documento_tipo_id: '',
    fecha: '',
    fecha_vence: '',
    id: null,
    numero: null,
    subtotal: 0,
    total: 0,
    total_bruto: 0,
    metodo_pago: null,
    detalles: [],
    impuestos: [],
  };
  tabActive = 1;
  detalles: any[] = [];
  constructor(
    private httpService: HttpService,
    private facturaService: FacturaService,
    private modalService: NgbModal
  ) {
    super();
    this.consultardetalle();
  }

  ngOnInit(): void {
    this._initForm();
  }

  private _initForm() {
    this.formularioGenerarArchivoPlano = this._formBuilder.group({
      id: [this.detalle],
      tipo_plano: [1, Validators.required],
    });
  }

  generarArchivoPlano() {
    if (this.formularioGenerarArchivoPlano.valid) {
      const tipoPlano = Number(
        this.formularioGenerarArchivoPlano.get('tipo_plano')?.value
      );
      this.formularioGenerarArchivoPlano.patchValue({
        tipo_plano: tipoPlano,
      });
      this.httpService.descargarArchivo(
        'general/documento/plano-banco/',
        this.formularioGenerarArchivoPlano.value
      );
    }

    this.modalService.dismissAll();
  }

  abrirModal(content: any) {
    this.tituloModal = 'Archivo plano';
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md',
    });
  }

  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.pago = respuesta.documento;
        this.detalles = this.pago.detalles; // Almacenamos los detalles de la factura
        this.changeDetectorRef.detectChanges();
      });
  }

  // Obtener total de débitos
  getTotalDebito(): number {
    return this.detalles
      .filter((detalle) => detalle.naturaleza === 'D') // Filtrar naturaleza 'D'
      .reduce((total, detalle) => total + detalle.precio, 0); // Acumular los valores de 'pago'
  }

  // Obtener total de créditos
  getTotalCredito(): number {
    return this.detalles
      .filter((detalle) => detalle.naturaleza === 'C') // Filtrar naturaleza 'C'
      .reduce((total, detalle) => total + detalle.precio, 0); // Acumular los valores de 'pago'
  }

  aprobar() {
    this.alertaService
      .confirmarSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            return this.httpService.post('general/documento/aprobar/', {
              id: this.detalle,
            });
          }
          return EMPTY;
        }),
        switchMap((respuesta) =>
          respuesta ? this.facturaService.consultarDetalle(this.detalle) : EMPTY
        ),
        tap((respuestaConsultaDetalle: any) => {
          this.pago = respuestaConsultaDetalle.documento;
          if (respuestaConsultaDetalle) {
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.DOCUMENTOAPROBADO')
            );
            this.changeDetectorRef.detectChanges();
          }
        })
      )
      .subscribe();
  }

  imprimir() {
    this.httpService.descargarArchivo('general/documento/imprimir/', {
      filtros: [],
      limite: 50,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: '',
      tipo: '',
      documento_tipo_id: 1,
      documento_id: this.detalle,
    });
  }

  anular() {
    this.alertaService
      .anularSinReversa()
      .pipe(
        switchMap((respuesta) => {
          if (respuesta.isConfirmed) {
            return this.httpService.post('general/documento/anular/', {
              id: this.detalle,
            });
          }
          return EMPTY;
        }),
        tap((respuesta: any) => {
          if (respuesta) {
            this.consultardetalle();
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.DOCUMENTOANULADO')
            );
          }
        })
      )
      .subscribe();
  }
  
  navegarEditar(id: number) {
    this.router.navigate([`tesoreria/documento/editar/${id}`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }

  navegarNuevo() {
    this.router.navigate([`tesoreria/documento/nuevo`], {
      queryParams: {
        ...this.parametrosUrl,
      },
    });
  }
}
