import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import { TranslateModule } from '@ngx-translate/core';
import { CuentasComponent } from '../../../../../../comun/componentes/cuentas/cuentas.component';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';
import { Subject, takeUntil } from 'rxjs';
import { General } from '@comun/clases/general';

@Component({
  selector: 'app-factura-cuenta',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    CuentasComponent,
    SeleccionarGrupoComponent,
  ],
  templateUrl: './factura-cuenta.component.html',
  styleUrl: './factura-cuenta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaCuentaComponent
  extends General
  implements OnInit, OnDestroy
{
  private _unsubscribe$ = new Subject<void>();

  public _formularioFacturaService = inject(FormularioFacturaService);
  public formularioFactura = this._formularioFacturaService.form;
  public estadoAprobado = false;
  public themeValue = localStorage.getItem('kt_theme_mode_value');

  ngOnInit(): void {}

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  get detalles(): FormArray {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  agregarNuevoItem(tipo_registro: String) {
    this._formularioFacturaService.agregarNuevoItem(tipo_registro);
    this.changeDetectorRef.detectChanges();
  }

  recibirCuentaSeleccionada(event: any, i: number) {
    this._formularioFacturaService.recibirCuentaSeleccionada(event, i);
    this.changeDetectorRef.detectChanges();
  }

  onPrecioChange(i: number) {
    this._formularioFacturaService
      .onPrecioChange(i)
      ?.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (valor) {
          this._formularioFacturaService.actualizarPrecioItem(i);
        }
      });
  }

  onDescuentoChange(i: number) {}

  onSeleccionarGrupoChange(event: string, i: number) {
    this._formularioFacturaService.onSeleccionarGrupoChange(event, i);
  }

  eliminarItem(i: number) {
    this._formularioFacturaService.eliminarItem(i);
  }
}
