import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { ItemFormularioComponent } from '../item-formulario/item-formulario.component';
import { ItemService } from '@modulos/general/servicios/item.service';
import { Item } from '@modulos/general/modelos/item';

@Component({
  selector: 'app-item-nuevo',
  templateUrl: './item-nuevo.component.html',
  styleUrls: ['./item-nuevo.component.scss'],
  standalone: true,
  imports: [ItemFormularioComponent],
})
export default class ItemNuevoComponent extends General implements OnInit {
  detalle = 0;
  accion: 'nuevo' | 'detalle';
  informacionFormulario = {
    codigo: '',
    costo: 0,
    id: 0,
    impuestos: [],
    nombre: '',
    precio: 0,
    referencia: '',
  };

  constructor(private itemService: ItemService) {
    super();
  }
  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParams['detalle']) {
      this.detalle = this.activatedRoute.snapshot.queryParams['detalle'];
      this.consultardetalle();
    }
  }

  consultardetalle() {
    this.itemService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.informacionFormulario = respuesta.item;
        this.changeDetectorRef.detectChanges();
      });

    this.changeDetectorRef.detectChanges();
  }
}
