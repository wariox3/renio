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
  templateUrl: './item-formulario.component.html',
})
export class ItemFormularioComponent
  extends General
  implements OnInit, OnChanges
{
  formularioItem: FormGroup;
  arrImpuestosEliminado: number[] = [];
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
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.informacionFormulario.currentValue) {
      this.initForm();
    }
  }

  initForm() {
    this.formularioItem = this.formBuilder.group({
      codigo: [
        this.informacionFormulario.codigo,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      nombre: [
        this.informacionFormulario.nombre,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      referencia: [
        this.informacionFormulario.referencia,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      precio: [
        this.informacionFormulario.precio,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(200),
          Validators.pattern(/^[a-z-0-9.-_]*$/),
        ]),
      ],
      impuestos: this.formBuilder.array(this.informacionFormulario.impuestos),
    });
  }

  get formFields() {
    return this.formularioItem.controls;
  }

  formSubmit() {
    if (this.formularioItem.valid) {
      if (this.activatedRoute.snapshot.queryParams['detalle']) {
        this.itemService.actualizarDatosItem(
          this.activatedRoute.snapshot.queryParams['detalle'],
          {
            ...this.formularioItem.value,
            ...{ impuestos_eliminados: this.arrImpuestosEliminado },
          }
        ).subscribe((respuesta)=>{
          this.arrImpuestosEliminado = []
          this.changeDetectorRef.detectChanges()
        });
      } else {
        this.itemService.guardarItem(this.formularioItem.value).subscribe((respuesta)=>{
        });
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
      impuesto: [impuesto.id],
    });
    arrImpuesto.push(impuestoFormGrup);

    this.changeDetectorRef.detectChanges();
  }

  removerImpuesto(impuesto: any) {

    const arrImpuesto = this.formularioItem.get('impuestos') as FormArray;

    let nuevosImpuestos = arrImpuesto.value.filter(
      (item: any) => item.impuesto !== impuesto.id || item.impuesto !== impuesto.impuesto_id
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
}
