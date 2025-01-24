import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { ModalDinamicoService } from '@comun/services/modal-dinamico.service';
import { ExtraService } from '@modulos/venta/servicios/extra.service';
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
  private extraService = inject(ExtraService);
  private modalDinamicoService = inject(ModalDinamicoService);
  @Output() emitirConsultaLista: EventEmitter<any> = new EventEmitter();

  public formularioVentaFacturaElectronica: FormGroup;
  public generando: boolean = false;

  constructor() {
    super();
    // this.inicializarFormulario();
  }

  // inicializarFormulario() {
  //   const anioActual = new Date().getFullYear();
  //   const fechaActual = new Date();
  //   const mesActual = fechaActual.getMonth() + 1;
  //   this.formularioVentaFacturaElectronica = this.formBuilder.group({
  //     anio: [anioActual, Validators.required],
  //     mes: [mesActual, Validators.required],
  //   });
  // }

  formSubmit() {
    this.generando = true;
    this.extraService
      .generarMasivo({ generar_todos: true })
      .pipe(
        finalize(() => {
          this.generando = false;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe((respuesta) => {
        this.alertaService.mensajaExitoso(
          '¡Facturas electrónicas generadas exitosamente!'
        );
        this.modalDinamicoService.emitirEvento(true);
      });
  }
}
