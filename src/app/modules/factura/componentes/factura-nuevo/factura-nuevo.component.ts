import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { TablaComponent } from '@comun/componentes/tabla/tabla.component';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ProductosComponent } from '@comun/componentes/productos/productos.component';
import { Item } from '@modulos/general/modelos/item';
import { Impuesto } from '@interfaces/general/impuesto';
import { asyncScheduler, tap, throttleTime } from 'rxjs';
import { FacturaService } from '@modulos/factura/servicios/factura.service';

@Component({
  selector: 'app-factura-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
    NgbNavModule,
    TablaComponent,
    ImpuestosComponent,
    ProductosComponent,
  ],
  templateUrl: './factura-nuevo.component.html',
  styleUrls: ['./factura-nuevo.component.scss'],
})
export default class FacturaNuevoComponent
  extends General
  implements OnInit, OnDestroy
{
  formularioFactura: FormGroup;
  active: Number;
  totalCantidad: number = 0;
  totalDescuento: number = 0;
  totalImpuestos: number = 0;
  totalGeneral: number = 0;
  subtotalGeneral: number = 0;
  totalNetoGeneral: number = 0;
  detalle = 0;
  informacionDetalle: any = {
    contacto_id: '',
    descuento: '',
    documento_tipo_id: '',
    fecha: '',
    fecha_vence: '',
    id: null,
    impuesto: 0,
    numero: null,
    subtotal: 0,
    total: 0,
    total_bruto: 0,
    metodo_pago: null
  };
  acumuladorImpuestos: any[] = [];
  arrMovimientosClientes: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private facturaService: FacturaService
  ) {
    super();
  }
  ngOnInit() {
    this.initForm();
    this.changeDetectorRef.detectChanges();
    this.active = 1;
    if (this.activatedRoute.snapshot.queryParams['detalle']) {
      this.detalle = this.activatedRoute.snapshot.queryParams['detalle'];
      this.consultardetalle();
    }
  }

  ngOnDestroy(): void {
    this.formSubmit();
  }

  initForm() {
    const fechaActual = new Date(); // Obtener la fecha actual
    const fechaVencimientoInicial = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;

    this.formularioFactura = this.formBuilder.group({
      cliente: ['', Validators.compose([Validators.required])],
      numero: ['', Validators.compose([Validators.required])],
      fechaVencimiento: [
        fechaVencimientoInicial,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      fechaFactura: [
        fechaVencimientoInicial,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      plazo: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      metodoPago: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      tipoOperacion: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      detalles: this.formBuilder.array([]),
    });
  }

  get detalles() {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  formSubmit() {
    if (this.formularioFactura.dirty) {
      this.facturaService.guardarFactura(this.formularioFactura.value);
    }
  }

  agregarProductos() {
    const detalleFormGroup = this.formBuilder.group({
      item: [0],
      cantidad: [0],
      precio: [0],
      porcentaje_descuento: [0],
      descuento: [0],
      subtotal: [0],
      total_bruto: [0],
      total: [0],
      neto: [0],
      impuestos: this.formBuilder.array([]),
    });

    this.detalles.push(detalleFormGroup);
    this.calcularTotales();
    this.changeDetectorRef.detectChanges();
  }

  onImpuestoBlur(index: number) {
    if (this.detalles.controls[index].get('item')?.value) {
      if (index === this.detalles.length - 1) {
        this.agregarProductos();
      }
    }
  }

  calcularTotales() {
    this.totalCantidad = 0;
    this.totalDescuento = 0;
    this.totalImpuestos = 0;
    this.totalGeneral = 0;
    this.subtotalGeneral = 0;
    this.totalNetoGeneral = 0;

    const detallesArray = this.formularioFactura.get('detalles') as FormArray;
    detallesArray.controls.forEach((detalleControl) => {
      const cantidad = detalleControl.get('cantidad')?.value || 0;
      const precio = detalleControl.get('precio')?.value || 0;
      const porcentajeDescuento = detalleControl.get('descuento')?.value || 0;
      let subtotal = cantidad * precio;
      let descuento = (porcentajeDescuento * subtotal) / 100;
      let neto = subtotal - descuento;

      this.totalCantidad += cantidad;
      this.totalDescuento += descuento;
      this.subtotalGeneral += subtotal;
      this.totalNetoGeneral += neto;

      const impuestos = detalleControl.get('impuestos')?.value || [];
      if (Array.isArray(impuestos)) {
        for (const impuesto of impuestos) {
          this.totalImpuestos += impuesto.total || 0;
        }
      } else {
        this.totalImpuestos += impuestos.total || 0;
      }
      detalleControl.get('subtotal')?.patchValue(subtotal);
      detalleControl.get('neto')?.patchValue(neto);
      this.changeDetectorRef.detectChanges();
    });

    this.totalGeneral =
      this.subtotalGeneral - this.totalDescuento + this.totalImpuestos;
  }

  agregarItemSeleccionado(item: Item, index: number) {
    this.detalles.controls[index].patchValue({
      precio: item.precio,
      item: item.id,
      cantidad: 1,
      subtotal: item.precio * 1,
    });
    this.calcularTotales();
  }

  eliminarProducto(index: number) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    const neto = detalleFormGroup.get('neto') as FormControl;

    for (const impuestoIndex in this.acumuladorImpuestos) {
      const impuesto = this.acumuladorImpuestos[impuestoIndex];

      impuesto.data = impuesto.data.filter((item: any) => {
        return item.index !== index;
      });

      // Verificar si el tamaño de data es cero y eliminar la posición si es así
      if (impuesto.data.length <= 0) {
        delete this.acumuladorImpuestos[impuestoIndex];
      } else {
        let totalImpuesto = 0;

        if (impuesto.data[0]) {
          totalImpuesto = (neto.value * impuesto.data[0].porcentaje) / 100;
          impuesto.total -= totalImpuesto;
        }
      }
    }

    console.log(this.acumuladorImpuestos);

    this.changeDetectorRef.detectChanges();

    this.detalles.removeAt(index);
    this.calcularTotales();
  }

  actualizarDetalle(index: number, campo: string, evento: any) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    detalleFormGroup.get(campo)?.patchValue(evento.target.value);
    this.changeDetectorRef.detectChanges();
    this.calcularTotales();
    this.actualizarImpuestos(index);
  }

  agregarImpuesto(impuesto: any, index: number) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    const subtotal = detalleFormGroup.get('subtotal') as FormControl;
    const neto = detalleFormGroup.get('neto') as FormControl;
    const item = detalleFormGroup.get('item') as FormControl;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    impuesto = {
      ...impuesto,
      index,
    };
    if (item.value) {
      let totalImpuesto = (neto.value * impuesto.porcentaje) / 100;
      if (!this.acumuladorImpuestos[impuesto.nombre]) {
        this.acumuladorImpuestos[impuesto.nombre] = {
          total: totalImpuesto,
          data: [impuesto],
        };
        let impuestoFormGrup = this.formBuilder.group({
          impuesto: [impuesto.id],
          base: [neto.value],
          porcentaje: [impuesto.porcentaje],
          total: [totalImpuesto],
          nombre: [impuesto.nombre],
        });
        arrDetalleImpuestos.push(impuestoFormGrup);
      } else {
        this.acumuladorImpuestos[impuesto.nombre].total += totalImpuesto;
        this.acumuladorImpuestos[impuesto.nombre].data.push(impuesto);
      }

      this.calcularTotales();
      this.changeDetectorRef.detectChanges();
    }
  }

  actualizarImpuestos(index: number) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    const subtotal = detalleFormGroup.get('subtotal') as FormControl;
    const neto = detalleFormGroup.get('neto') as FormControl;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    arrDetalleImpuestos.controls.forEach((impuestoControl) => {
      let totalImpuesto = (neto.value * impuestoControl.value.porcentaje) / 100;
    });
  }

  removerImpuesto(impuesto: any, index: number) {
    const detalleFormGroup = this.detalles.at(index) as FormGroup;
    const arrDetalleImpuestos = detalleFormGroup.get('impuestos') as FormArray;
    const subtotal = detalleFormGroup.get('subtotal') as FormControl;
    const neto = detalleFormGroup.get('neto') as FormControl;
    let nuevosImpuestos = arrDetalleImpuestos.value.filter(
      (item: any) => item.impuesto !== impuesto.id
    );

    // Limpiar el FormArray actual
    arrDetalleImpuestos.clear();
    // Agregar los impuestos filtrados de nuevo al FormArray
    nuevosImpuestos.forEach((item: any) => {
      const nuevoDetalle = this.formBuilder.group({
        // Aquí debes definir la estructura de tu FormGroup para un impuesto
        impuesto: [item.impuesto],
        base: [neto.value],
        porcentaje: [19],
        total: [10],
      });
      arrDetalleImpuestos.push(nuevoDetalle);
    });

    this.acumuladorImpuestos[impuesto.nombre].data = this.acumuladorImpuestos[
      impuesto.nombre
    ].data.filter(
      (impuestoAcumulado: any) => impuestoAcumulado.index !== index
    );
    let totalImpuesto = (neto.value * impuesto.porcentaje) / 100;
    this.acumuladorImpuestos[impuesto.nombre].total -= totalImpuesto;

    if (this.acumuladorImpuestos[impuesto.nombre].total <= 0) {
      delete this.acumuladorImpuestos[impuesto.nombre];
      this.changeDetectorRef.detectChanges();
    }

    this.calcularTotales();
    this.changeDetectorRef.detectChanges();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioFactura.get(campo)?.patchValue(dato);
    this.changeDetectorRef.detectChanges();
  }

  consultarCliente(event: any) {
    let arrFiltros = {
      filtros: [
        {
          id: '1692284537644-1688',
          operador: '__contains',
          propiedad: 'nombre_corto__contains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'Contacto',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista-autocompletar/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrMovimientosClientes = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  actualizarDatos(event: any, campo: string) {
    let data: any = {
      documento_tipo: 1,
    };

    data[campo] = event.target.innerText;
    this.facturaService.actualizarDatosFactura(this.detalle, data);
  }

  consultardetalle() {
    this.facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.informacionDetalle = respuesta;
      });
  }
}
