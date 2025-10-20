import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { ExtraService } from '@modulos/venta/servicios/extra.service';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-generar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GenerarSeleccionadosComponent extends General {
  private extraService = inject(ExtraService);
  @Output() emitirConsultaLista: EventEmitter<any> = new EventEmitter();

  public formularioVentaFacturaElectronica: FormGroup;
  public generando: boolean = false;

  constructor() {
    super();
  }

  formSubmit(ids: number[]) {
    if (ids.length === 0) {
      this.alertaService.mensajeError('Error', 'No se cuenta con registros seleccionados');
      return
    }
    this.generando = true;
    this.extraService
      .generarMasivo({ generar_todos: false, ids })
      .pipe(
        finalize(() => {
          this.generando = false;
          this.changeDetectorRef.detectChanges();

          return of(true)
        }),
        catchError(() => {
          this.alertaService.mensajeError('Error', 'No se pudieron generar las facturas');
          return of(false);

        })
      )
      .subscribe((respuesta) => {
        this.alertaService.mensajaExitoso(
          '¡Facturas electrónicas generadas exitosamente!'
        );
        return of(respuesta);
      });
  }
}
