import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import { TranslateModule } from '@ngx-translate/core';
import { CuentasComponent } from '../../../../../../comun/componentes/cuentas/cuentas.component';
import { SeleccionarGrupoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-grupo/seleccionar-grupo.component';
import { Subject, takeUntil } from 'rxjs';
import { General } from '@comun/clases/general';
import { SeleccionarContactoComponent } from '../../../../../../comun/componentes/factura/components/seleccionar-contacto/seleccionar-contacto.component';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';

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
    SeleccionarContactoComponent,
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
  public formularioFactura: FormGroup;
  public estadoAprobado = this._formularioFacturaService.estadoAprobado;
  public themeValue = localStorage.getItem('kt_theme_mode_value');

  constructor() {
    super();
  }

  ngOnInit(): void {
    this._formularioFacturaService.form$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((form) => {
        this.formularioFactura = form;
      });
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  get detalles(): FormArray {
    return this.formularioFactura.get('detalles') as FormArray;
  }

  onBaseImpuestoChange(i: number) {}

  agregarNuevoItem(tipo_registro: string) {
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

  onNaturalezaChange(i: number) {
    this._formularioFacturaService
      .onNaturalezaChange(i)
      ?.pipe(takeUntil(this._unsubscribe$))
      .subscribe((valor: string) => {
        if (valor) {
          this._formularioFacturaService.actualizarPrecioItem(i);
        }
      });
  }

  onSeleccionarGrupoChange(event: number, i: number) {
    this._formularioFacturaService.onSeleccionarGrupoChange(event, i);
  }

  eliminarItem(i: number) {
    this._formularioFacturaService.eliminarItem(i);
  }

  recibirContactoSeleccionado(
    contacto: RegistroAutocompletarGenContacto,
    index: number,
  ) {
    if (!contacto) {
      this._formularioFacturaService.onSeleccionarContactoChange(null, index);
    } else {
      this._formularioFacturaService.onSeleccionarContactoChange(
        contacto,
        index,
      );
    }
  }
}
