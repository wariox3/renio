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
import { tap } from 'rxjs';
import { Item } from '@interfaces/general/item';

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
  arrImpuestosEliminado: number[] = [];
  arrImpuestos: any[] = [];
  item: any
  @Input() informacionFormulario: any;
  @ViewChild('inputImpuestos', { static: false })
  inputImpuestos: HTMLInputElement;

  constructor(
    private itemService: ItemService
  ) {
    super();
  }
  ngOnInit() {
  	this.consultardetalle();
  }



  consultardetalle() {
    this.itemService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {        
        this.item = respuesta.item
        this.changeDetectorRef.detectChanges();
      });
  }
}
