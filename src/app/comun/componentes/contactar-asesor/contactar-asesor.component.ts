import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputValueCaseDirective } from '@comun/directive/input-value-case.directive';
import { AlertaService } from '@comun/services/alerta.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contactar-asesor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    InputValueCaseDirective,
  ],
  templateUrl: './contactar-asesor.component.html',
  styleUrl: './contactar-asesor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactarAsesorComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _httpService = inject(HttpClient);
  private readonly _alertaService = inject(AlertaService);
  private readonly _modalService = inject(NgbModal);

  public formularioContactoNegocio: FormGroup;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.initForm();
  }

  initForm() {
    this.formularioContactoNegocio = this._formBuilder.group({
      nombre: [null, Validators.compose([Validators.maxLength(200)])],
      correo: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(255),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ]),
      ],
      telefono: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      empresa: [null],
      descripcion: [null],
      codigoProyecto: [8],
    });
  }

  enviarFormulario() {
    if (this.formularioContactoNegocio.valid) {
      this._httpService
        .post(
          'https://semantica.com.co/api/negocio/nuevo',
          this.formularioContactoNegocio.value,
        )
        .subscribe(() => {
          this.formularioContactoNegocio.reset();
          this.formularioContactoNegocio.markAsUntouched();
          this.formularioContactoNegocio.markAsDirty();
          this._modalService.dismissAll();
          this._alertaService.mensajaContactoLandinpage(
            'Hemos enviado su información, uno de nuestros asesores se estará comunicando',
          );
        });
    } else {
      this.formularioContactoNegocio.markAllAsTouched();
    }
  }
}
