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
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { HttpService } from '@comun/services/http.service';
import { EventosDianService } from '@modulos/compra/servicios/eventos-dian.service';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, finalize, tap } from 'rxjs';

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
  visualizarBtnCargando$: BehaviorSubject<boolean> = new BehaviorSubject(false);

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

    this.formularioModal.get('referencia_prefijo')?.valueChanges.subscribe((valor) => {
      const valorMayuscula = valor?.toUpperCase() || ''; // Convierte a mayúsculas
      if (valor !== valorMayuscula) {
        this.formularioModal.get('referencia_prefijo')?.setValue(valorMayuscula, { emitEvent: false });
      }
    });
  }

  formSubmit() {
    if (this.formularioModal.valid) {
      this.visualizarBtnCargando$.next(true)
       this.facturaService.actualizarDatosFactura(
         this.documento.id,
         {
          ...this.formularioModal.value,
          ...{
            'saltar_aprobado': true
          }
         }
       ).pipe(
        tap((respuesta: any) => {
          this.alertaService.mensajaExitoso(
            this.translateService.instant('MENSAJES.ACTUALIZARINFORMACION')
          );
          this.emitirConsultarLista.emit();
          this.modalService.dismissAll();
        }),
        finalize(() => {
          this.visualizarBtnCargando$.next(false);
          this.emitirConsultarLista.emit();
          this.modalService.dismissAll();
        })
       )

       .subscribe();
    } else {
       this.formularioModal.markAllAsTouched();
    }
  }
}
