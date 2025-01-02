import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { ModalDinamicoService } from '@comun/services/modal-dinamico.service';
import { NominaElectronicaService } from '@modulos/humano/servicios/nomina-electronica.service';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-generar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './generar.component.html',
  styleUrl: './generar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GenerarComponent extends General {
  private formBuilder = inject(FormBuilder);
  private nominaElectronicaService = inject(NominaElectronicaService);
  private modalDinamicoService = inject(ModalDinamicoService);
  @Output() emitirConsultaLista: EventEmitter<any> = new EventEmitter();

  public formularioVentaFacturaElectronica: FormGroup;
  public generando: boolean = false;

  constructor() {
    super();
    this.inicializarFormulario();
  }

  inicializarFormulario() {
    const anioActual = new Date().getFullYear();
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth() + 1;
    this.formularioVentaFacturaElectronica = this.formBuilder.group({
      anio: [anioActual, Validators.required],
      mes: [mesActual, Validators.required],
    });
  }

  formSubmit() {
    this.generando = true;
    this.nominaElectronicaService
      .generarNominaElectronica(this.formularioVentaFacturaElectronica.value)
      .pipe(finalize(() => {
        this.generando = false
        this.changeDetectorRef.detectChanges()
      }))
      .subscribe((respuesta) => {
        this.alertaService.mensajaExitoso(
          '¡Nóminas electrónicas generadas exitosamente!'
        );
        this.modalDinamicoService.emitirEvento(true);
      });
  }
}
