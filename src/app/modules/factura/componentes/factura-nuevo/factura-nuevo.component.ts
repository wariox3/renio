import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    ProductosComponent
  ],
  templateUrl: './factura-nuevo.component.html',
  styleUrls: ['./factura-nuevo.component.scss'],
})
export default class FacturaNuevoComponent extends General implements OnInit {

  formularioFactura: FormGroup;
  active:Number;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService
  ) {
    super();
  }
  ngOnInit() {
    this.initForm();
    this.active = 1
    this.changeDetectorRef.detectChanges()
  }

  initForm() {
    this.formularioFactura = this.formBuilder.group(
      {
        movimiento_tipo: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        numero: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
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
      },
    );
  }

  get detalles() {
    return this.formularioFactura.get('detalles') as FormArray;
  }


  formSubmit(){

  }

  agregarProductos(){

    this.detalles.push(
      this.formBuilder.group({
        propiedad: [''],
        operador: [''],
        valor1: [''],
        valor2: [''],
        item:53,
        cantidad:1,
        precio:1800,
        porcentaje_descuento:0,
        descuento:0,
        subtotal:1800,
        total_bruto:1800,
        total:1800,
        impuestos: [
            {
                "impuesto":1,
                "base":1800,
                "porcentaje":19,
                "total":342
            }
        ]
      })
    )

    console.log(this.formularioFactura.value);

    this.changeDetectorRef.detectChanges()
  }

  onImpuestoBlur(index: number) {
    if (index === this.detalles.length - 1) {
      this.agregarProductos();
    }
  }
}
