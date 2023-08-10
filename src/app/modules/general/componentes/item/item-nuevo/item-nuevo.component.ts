import { Component, OnInit } from '@angular/core';
import { General } from '@comun/clases/general';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { ItemFormularioComponent } from '../item-formulario/item-formulario.component';


@Component({
  selector: 'app-item-nuevo',
  templateUrl: './item-nuevo.component.html',
  styleUrls: ['./item-nuevo.component.scss'],
  standalone: true,
  imports: [
    ItemFormularioComponent
  ]

})
export default class ItemNuevoComponent extends General implements OnInit {


  constructor(
  ) {
    super();
  }
  ngOnInit() {
  }

}
