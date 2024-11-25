import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { SoloNumerosDirective } from '@comun/Directive/solo-numeros.directive';
import { HttpService } from '@comun/services/http.service';
import { EventosDianService } from '@modulos/compra/servicios/eventos-dian.service';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-editar-eventos-dian',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SoloNumerosDirective,
  ],
  templateUrl: './editar-eventos-dian.component.html',
})
export class EditarEventosDianComponent extends General {
  public formularioModal: FormGroup;

  @Input() documento: any;
  @Output() emitirConsultarLista: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private httpService: HttpService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private facturaService: FacturaService,
    private eventosDianService: EventosDianService
  ) {
    super();
  }

  abrirModal(content: any) {
    this._inicializarFormulario();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });

    this.changeDetectorRef.detectChanges();
  }

  private _inicializarFormulario() {
    this.formularioModal = this.formBuilder.group({
      referencia_prefijo: [this.documento.referencia_prefijo],
      referencia_numero: [this.documento.referencia_numero],
      referencia_cue: [this.documento.referencia_cue],
    });
  }

  formSubmit() {
    if (this.formularioModal.valid) {
       this.facturaService.actualizarDatosFactura(
         this.documento.id,
         this.formularioModal.value
       ).subscribe();
    } else {
       this.formularioModal.markAllAsTouched();
    }
  }
}
