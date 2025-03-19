import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { General } from '@comun/clases/general';
import { BtnAtrasComponent } from '@comun/componentes/btn-atras/btn-atras.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ItemService } from '@modulos/general/servicios/item.service';
import { SiNoPipe } from '@pipe/si-no.pipe';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CargarArchivosComponent } from '../../../../../comun/componentes/cargar-archivos/cargar-archivos.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CargarImagenComponent } from '../../../../../comun/componentes/cargar-imagen/cargar-imagen.component';

@Component({
  selector: 'app-item-detalle',
  standalone: true,
  templateUrl: './item-detalle.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    BtnAtrasComponent,
    TituloAccionComponent,
    SiNoPipe,
    NgbDropdownModule,
    CargarArchivosComponent,
    ImageCropperModule,
    CargarImagenComponent,
  ],
})
export default class ItemDetalleComponent extends General implements OnInit {
  private readonly _modalService = inject(NgbModal);
  srcResult: string = 'src/assets/media/avatars/blank.png';
  imageChangedEvent: any = '';
  arrImpuestosEliminado: number[] = [];
  item: any = {
    nombre: '',
    id: 0,
    impuestos: [],
    codigo: null,
    referencia: null,
    costo: 0,
    precio: 0,
    base: 0,
    porcentaje: 0,
    total: 0,
    nombre_extendido: '',
    porcentaje_total: 0,
    venta: false,
    compra: false,
  };
  @Input() informacionFormulario: any;
  @ViewChild('inputImpuestos', { static: false })
  inputImpuestos: HTMLInputElement;

  constructor(private itemService: ItemService) {
    super();
  }

  ngOnInit() {
    this.consultardetalle();
  }

  consultardetalle() {
    this.itemService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.item = respuesta.item;
        this.changeDetectorRef.detectChanges();
      });
  }

  get impuestosVenta() {
    return this.item.impuestos.filter(
      (impuesto: any) => impuesto.impuesto_venta,
    );
  }

  get impuestosCompra() {
    return this.item.impuestos.filter(
      (impuesto: any) => impuesto.impuesto_compra,
    );
  }

  abrirModalImagenes(content: any) {
    this._abirModal(content);
  }

  private _abirModal(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  recuperarBase64(base64: string) {
    this.itemService
      .cargarImagen(this.detalle, base64)
      .subscribe((response) => {
        this.consultardetalle();
        this.alertaService.mensajaExitoso(response.mensaje);
      });
  }

  eliminarLogo(event: boolean) {
    // this.store
    //   .select(obtenerUsuarioId)
    //   .pipe(
    //     switchMap((codigoUsuario) =>
    //       this.resumenService.eliminarImagen(codigoUsuario)
    //     ),
    //     tap((respuestaEliminarImagen) => {
    //       if (respuestaEliminarImagen.limpiar) {
    //         this.store.dispatch(
    //           usuarioActionActualizarImagen({
    //             imagen: respuestaEliminarImagen.imagen,
    //           })
    //         );
    //         this.alertaService.mensajaExitoso(
    //           this.translateService.instant(
    //             'FORMULARIOS.MENSAJES.COMUNES.ACTUALIZACION'
    //           )
    //         );
    //       }
    //     })
    //   )
    //   .subscribe();
  }
}
