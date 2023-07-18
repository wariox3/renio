import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { General } from '@comun/clases/general';
import { AlertaService } from '@comun/services/alerta.service';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@modulos/general/modelos/item';
import { Store } from '@ngrx/store';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-item-nuevo',
  templateUrl: './item-nuevo.component.html',
  styleUrls: ['./item-nuevo.component.scss']
})
export class ItemNuevoComponent extends General implements OnInit {

  formularioItemNuevo: FormGroup;
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private renderer2: Renderer2,
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formularioItemNuevo = this.formBuilder.group(
      {
        nombre: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(200),
            Validators.pattern(/^[a-z-0-9.-_]*$/),  // Se ha removido la restricción de mayúsculas
          ]),
        ],
      },
    );
  }

  get formFields() {
    return this.formularioItemNuevo.controls;
  }

  formSubmit() {
    if (this.formularioItemNuevo.valid) {
      this.renderer2.setAttribute(
        this.btnGuardar.nativeElement,
        'disabled',
        'true'
      );
      this.renderer2.setProperty(
        this.btnGuardar.nativeElement,
        'innerHTML',
        'Procesando'
      );
      this.store
        .select(obtenerUsuarioId)
        .pipe(
          switchMap(([usuarioId]) =>
            this.httpService.post<Item>(
              'general/item/',
              {
                nombre: this.formFields.nombre.value
              },
            )
          )
        )
        .subscribe({
          next: (respuesta) => {
            this.renderer2.setAttribute(
              this.btnGuardar.nativeElement,
              'disabled',
              'true'
            );
            this.renderer2.setProperty(
              this.btnGuardar.nativeElement,
              'innerHTML',
              'Guardar'
            );
            this.alertaService.mensajaExitoso(
              this.translateService.instant("")
              //'Nueva empresa creada'
            );
          },
          error: ({ error }) => {
            this.renderer2.removeAttribute(
              this.btnGuardar.nativeElement,
              'disabled'
            );
            this.renderer2.setProperty(
              this.btnGuardar.nativeElement,
              'innerHTML',
              'Guardar'
            );
            this.alertaService.mensajeError(
              'Error consulta',
              `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
            );
          },
        });
    } else {
      this.formularioItemNuevo.markAllAsTouched();
    }
  }

  limpiarFormulario() {
    this.formularioItemNuevo.reset();
  }

}
