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
import { SeleccionarProductoComponent } from '@comun/componentes/factura/components/seleccionar-producto/seleccionar-producto.component';
import { DocumentoDetalleFactura } from '@interfaces/comunes/factura/factura.interface';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-configuracion-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, NgbNavModule, SeleccionarProductoComponent],
  templateUrl: './configuracion-venta.component.html',
})
export class ConfiguracionVentaComponent extends General implements OnInit {
  formularioEmpresa: FormGroup;
  active = 1;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.consultarInformacion();
  }

  initForm() {
    this.formularioEmpresa = this.formBuilder.group({
      id: [1],
      empresa: [1],
      informacion_factura: [
        null,
        Validators.compose([Validators.maxLength(2000)]),
      ],
      informacion_factura_superior: [
        null,
        Validators.compose([Validators.maxLength(2000)]),
      ],
      venta_asesor: [false],
      venta_sede: [false],
      gen_item_administracion: [null],
      gen_item_administracion_nombre: [null],
      gen_item_imprevisto: [null],
      gen_item_imprevisto_nombre: [null],
      gen_item_utilidad: [null],
      gen_item_utilidad_nombre: [null],
    });
  }

  consultarInformacion() {
    this.empresaService
      .obtenerConfiguracionEmpresa(1)
      .subscribe((respuesta: any) => {
        this.formularioEmpresa.patchValue({
          informacion_factura: respuesta.informacion_factura,
          informacion_factura_superior: respuesta.informacion_factura_superior,
          venta_asesor: respuesta.venta_asesor,
          venta_sede: respuesta.venta_sede,
          gen_item_administracion: respuesta.gen_item_administracion,
          gen_item_administracion_nombre: respuesta.gen_item_administracion__nombre,
          gen_item_imprevisto: respuesta.gen_item_imprevisto,
          gen_item_imprevisto_nombre: respuesta.gen_item_imprevisto__nombre,
          gen_item_utilidad: respuesta.gen_item_utilidad,
          gen_item_utilidad_nombre: respuesta.gen_item_utilidad__nombre,
        });
      });
  }

  formSubmit() {
    if (this.formularioEmpresa.valid) {
      this.empresaService
        .configuracionEmpresa(1, this.formularioEmpresa.value)
        .pipe(
          tap((respuestaActualizacion: any) => {
              this.alertaService.mensajaExitoso(
                this.translateService.instant(
                  'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION',
                ),
              );
          }),
        )
        .subscribe();
    } else {
      this.formularioEmpresa.markAllAsTouched();
    }
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioEmpresa?.markAsDirty();
    this.formularioEmpresa?.markAsTouched();
    if (campo === 'informacion_factura') {
      if (this.formularioEmpresa.get(campo)?.value === '') {
        this.formularioEmpresa.get(campo)?.setValue(null);
      }
    }
    if (campo === 'informacion_factura_superior') {
      if (this.formularioEmpresa.get(campo)?.value === '') {
        this.formularioEmpresa.get(campo)?.setValue(null);
      }
    }
    this.changeDetectorRef.detectChanges();
  }

  // Métodos para manejar selección de items AIU
  recibirItemAdministracionSeleccionado(item: DocumentoDetalleFactura) {
    this.formularioEmpresa.patchValue({
      gen_item_administracion: item.id,
      gen_item_administracion_nombre: item.nombre,
    });
    this.formularioEmpresa.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  recibirItemImprevistoSeleccionado(item: DocumentoDetalleFactura) {
    this.formularioEmpresa.patchValue({
      gen_item_imprevisto: item.id,
      gen_item_imprevisto_nombre: item.nombre,
    });
    this.formularioEmpresa.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  recibirItemUtilidadSeleccionado(item: DocumentoDetalleFactura) {
    this.formularioEmpresa.patchValue({
      gen_item_utilidad: item.id,
      gen_item_utilidad_nombre: item.nombre,
    });
    this.formularioEmpresa.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  recibirLineaVaciaAdministracion(lineaVacia: boolean) {
    this.formularioEmpresa.patchValue({
      gen_item_administracion: null,
    });
    this.formularioEmpresa.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  recibirLineaVaciaImprevisto(lineaVacia: boolean) {
    this.formularioEmpresa.patchValue({
      gen_item_imprevisto: null,
    });
    this.formularioEmpresa.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }

  recibirLineaVaciaUtilidad(lineaVacia: boolean) {
    this.formularioEmpresa.patchValue({
      gen_item_utilidad: null,
    });
    this.formularioEmpresa.markAsDirty();
    this.changeDetectorRef.detectChanges();
  }
}
