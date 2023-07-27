import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@modulos/general/modelos/item';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-item-nuevo',
  templateUrl: './item-nuevo.component.html',
  styleUrls: ['./item-nuevo.component.scss']
})
export class ItemNuevoComponent extends General implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private renderer2: Renderer2,
  ) {
    super();
  }

  ngOnInit() {
  }



}
