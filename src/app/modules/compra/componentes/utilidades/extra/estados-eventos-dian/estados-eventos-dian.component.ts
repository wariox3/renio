import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import {
  AutocompletarRegistros,
  RegistroAutocompletarIdentificacion,
} from '@interfaces/comunes/autocompletar';
import { TipoIdentificacion } from '@interfaces/general/tipoIdentificacion';
import { EventosDianService } from '@modulos/compra/servicios/eventos-dian.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { zip } from 'rxjs';

@Component({
  selector: 'app-estados-eventos-dian',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './estados-eventos-dian.component.html',
  styleUrl: './estados-eventos-dian.component.scss',
})
export class EstadosEventosDianComponent extends General {
  public formularioModal: FormGroup;
  public arrIdentificacion: TipoIdentificacion[] = [];

  @Input({ required: true }) estado: string;
  @Input({ required: true }) visualizarBtnRecibir: boolean = false;
  @Input({ required: true }) eventoTipo:
    | 'evento_aceptacion'
    | 'evento_documento'
    | 'evento_recepcion';
  @Output() emitirConsuatarLista: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private httpService: HttpService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private eventosDianService: EventosDianService
  ) {
    super();
  }

  abrirModal(content: any) {
    this.consultarInformacion();
    this._inicializarFormulario();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });

    this.changeDetectorRef.detectChanges();
  }

  private _inicializarFormulario() {
    this.formularioModal = this.formBuilder.group({
      cue: ['', Validators.compose([Validators.required])],
      nombre: ['', Validators.compose([Validators.required])],
      apellidos: ['', Validators.compose([Validators.required])],
      identificacion: ['', Validators.compose([Validators.required])],
      numero_identificacion: ['', Validators.compose([Validators.required])],
      cargo: ['', Validators.compose([Validators.required])],
      departamento: ['', Validators.compose([Validators.required])],
    });
  }

  consultarInformacion() {
    zip(
      this.httpService.post<
        AutocompletarRegistros<RegistroAutocompletarIdentificacion>
      >('general/funcionalidad/lista/', {
        modelo: 'GenIdentificacion',
        serializador: 'ListaAutocompletar',
      })
    ).subscribe((respuesta: any) => {
      this.arrIdentificacion = respuesta[0].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  formSubmit() {
    if (this.formularioModal.valid) {
      this.emitirConsuatarLista.emit();
      this.modalService.dismissAll();
    } else {
      this.formularioModal.markAllAsTouched();
    }
  }
}
