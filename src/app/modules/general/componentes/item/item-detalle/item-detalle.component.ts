import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
import { General } from '@comun/clases/general';
import { ImpuestosComponent } from '@comun/componentes/impuestos/impuestos.component';
import { ItemService } from '@modulos/general/servicios/item.service';

@Component({
  selector: 'app-item-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslationModule,
    ImpuestosComponent,
  ],
  templateUrl: './item-detalle.component.html',
})
export default class ItemDetalleComponent extends General implements OnInit {
  formularioItem: FormGroup;
  arrImpuestosEliminado: number[] = [];
  arrImpuestos: any[] = [];
  @Input() informacionFormulario: any;
  @ViewChild('inputImpuestos', { static: false })
  inputImpuestos: HTMLInputElement;

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ItemService
  ) {
    super();
  }
  ngOnInit() {
    this.iniciarFormulario();
    if (this.detalle) {
      this.consultardetalle();
    }
  }

  iniciarFormulario() {
    this.formularioItem = this.formBuilder.group({
      codigo: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      nombre: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ]),
      ],
      referencia: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
        ]),
      ],
      precio: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      impuestos: this.formBuilder.array([]),
    });
  }

  get obtenerFormularioCampos() {
    return this.formularioItem.controls;
  }

  enviarFormulario() {
    if (this.formularioItem.valid) {
      if (this.activatedRoute.snapshot.queryParams['detalle']) {
        this.itemService
          .actualizarDatosItem(
            this.activatedRoute.snapshot.queryParams['detalle'],
            {
              ...this.formularioItem.value,
              ...{ impuestos_eliminados: this.arrImpuestosEliminado },
            }
          )
          .subscribe((respuesta) => {
            this.formularioItem.patchValue({
              codigo: respuesta.item.codigo,
              nombre: respuesta.item.nombre,
              referencia: respuesta.item.referencia,
              precio: respuesta.item.precio,
            });

            let arrImpuesto = this.obtenerFormularioCampos.impuestos as FormArray;

            arrImpuesto.clear();

            respuesta.item.impuestos.map((impuesto: any) => {
              arrImpuesto.push(
                this.formBuilder.group({
                  impuesto: impuesto,
                })
              );
            });
            this.arrImpuestos = respuesta.item.impuestos;
            this.arrImpuestosEliminado = [];

            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.itemService
          .guardarItem(this.formularioItem.value)
          .subscribe((respuesta) => {});
      }
    } else {
      this.formularioItem.markAllAsTouched();
    }
  }

  limpiarFormulario() {
    this.formularioItem.reset();
  }

  agregarImpuesto(impuesto: any) {
    const arrImpuesto = this.formularioItem.get('impuestos') as FormArray;
    let impuestoFormGrup = this.formBuilder.group({
      impuesto: [impuesto.impuesto_id],
    });
    arrImpuesto.push(impuestoFormGrup);

    this.changeDetectorRef.detectChanges();
  }

  removerImpuesto(impuesto: any) {
    const arrImpuesto = this.formularioItem.get('impuestos') as FormArray;

    let nuevosImpuestos = arrImpuesto.value.filter(
      (item: any) =>
        item.impuesto !== impuesto.id || item.impuesto !== impuesto.impuesto_id
    );

    // Limpiar el FormArray actual
    arrImpuesto.clear();

    nuevosImpuestos.forEach((item: any) => {
      const nuevoDetalle = this.formBuilder.group({
        // Aquí debes definir la estructura de tu FormGroup para un impuesto
        impuesto: [item.impuesto],
      });
      arrImpuesto.push(nuevoDetalle);
    });

    if (impuesto.id != null) {
      this.arrImpuestosEliminado.push(impuesto.id);
    }

    this.changeDetectorRef.detectChanges();
  }

  consultardetalle() {
    this.itemService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioItem.patchValue({
          codigo: respuesta.item.codigo,
          nombre: respuesta.item.nombre,
          referencia: respuesta.item.referencia,
          precio: respuesta.item.precio,
        });

        let arrImpuesto = this.obtenerFormularioCampos.impuestos as FormArray;

        arrImpuesto.clear();

        respuesta.item.impuestos.map((impuesto: any) => {
          arrImpuesto.push(
            this.formBuilder.group({
              impuesto: impuesto,
            })
          );
        });
        this.arrImpuestos = respuesta.item.impuestos;
        // this.calcularTotales();
        this.changeDetectorRef.detectChanges();
      });
  }
}
