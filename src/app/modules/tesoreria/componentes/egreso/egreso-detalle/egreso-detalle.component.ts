import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { HttpService } from '@comun/services/http.service';

import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

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

    this.modalService.dismissAll()
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
        this.changeDetectorRef.detectChanges();
      });
  }

  aprobar() {
    this.httpService
      .post('general/documento/aprobar/', { id: this.detalle })
      .subscribe((respuesta: any) => {
        this.consultardetalle();
        this.alertaService.mensajaExitoso('Documento aprobado');
      });
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
    this.httpService
      .post('general/documento/anular/', { id: this.detalle })
      .subscribe((respuesta: any) => {
        this.consultardetalle();
        this.alertaService.mensajaExitoso('Documento anulado');
      });
  }
}
