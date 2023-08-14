import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
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
export default class FacturaNuevoComponent extends General implements OnInit {
  formularioFactura: FormGroup;
  active: Number;
  totalCantidad: number = 0;
  totalPrecio: number = 0;
  totalDescuento: number = 0;
  totalImpuestos: number = 0;
  totalGeneral: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService
  ) {
    super();
  }
  ngOnInit() {
    this.initForm();
    this.changeDetectorRef.detectChanges();
    this.active = 1;
  }

  initForm() {
    this.formularioFactura = this.formBuilder.group({
      movimiento_tipo: ['', Validators.compose([Validators.required])],
      numero: ['', Validators.compose([Validators.required])],
      fechaVencimiento: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      fechaFactura: [
        '',
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
      tipoDocumento: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      url: [
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

  formSubmit() {}

  detalle = {
    cantidad: 0,
    precio: 0,
    descuento: 0,
  };

  agregarProductos() {
    this.detalles.push(
      this.formBuilder.group({
        propiedad: [''],
        operador: [''],
        valor1: [''],
        valor2: [''],
        item: 53,
        cantidad: 1,
        precio: 1800,
        porcentaje_descuento: 0,
        descuento: 0,
        subtotal: 1800,
        total_bruto: 1800,
        total: 1800,
        impuestos: [
          {
            impuesto: 1,
            base: 1800,
            porcentaje: 19,
            total: 342,
          },
        ],
      })
    );
    this.calcularTotales();
    this.changeDetectorRef.detectChanges();
    console.log(this.formularioFactura.value);

  }

  onImpuestoBlur(index: number) {
    if (index === this.detalles.length - 1) {
      this.agregarProductos();
    }
  }

  calcularTotales() {
    this.totalCantidad = 0;
    this.totalPrecio = 0;
    this.totalDescuento = 0;
    this.totalImpuestos = 0;
    this.totalGeneral = 0;
  
    const detallesArray = this.formularioFactura.get('detalles') as FormArray;
    detallesArray.controls.forEach((detalleControl) => {
      const cantidad = detalleControl.get('cantidad')?.value || 0;
      const precio = detalleControl.get('precio')?.value || 0;
      const descuento = detalleControl.get('descuento')?.value || 0;
  
      this.totalCantidad += cantidad;
      this.totalPrecio += cantidad * precio;
      this.totalDescuento += descuento;
  
      const impuestos = detalleControl.get('impuestos')?.value || [];
  
      if (Array.isArray(impuestos)) {
        for (const impuesto of impuestos) {
          this.totalImpuestos += impuesto.total || 0;
        }
      } else {
        this.totalImpuestos += impuestos.total || 0;
      }
    });
  
    this.totalGeneral = this.totalPrecio - this.totalDescuento + this.totalImpuestos;
  }
  
}
