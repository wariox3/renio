import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { SeleccionarImpuestosComponent } from '../seleccionar-impuestos/seleccionar-impuestos.component';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImpuestoRespuestaConsulta } from '@interfaces/comunes/factura/factura.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-extraer-iva',
  standalone: true,
  imports: [SoloNumerosDirective, SeleccionarImpuestosComponent, ReactiveFormsModule],
  templateUrl: './extraer-iva.component.html',
  styleUrl: './extraer-iva.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExtraerIvaComponent implements OnInit, OnDestroy {
  @Input() formularioIndex: number = 0;
  @Input() formularioTipo: 'venta' | 'compra' = 'venta';

  private _formularioFacturaService = inject(FormularioFacturaService);
  private _modalService = inject(NgbModal);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  public precioControl = new FormControl(0);
  public formularioFactura = this._formularioFacturaService.form;
  public precioBase = signal(0);

  ngOnInit(): void {
    const precioInicial = this.detalles.at(this.formularioIndex)?.get('neto')?.value || 0;
    
    // Suscribirse a cambios del input para actualizar precio base en tiempo real
    this.precioControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(precio => {
        if (precio && precio > 0) {
          this.calcularPrecioBase(precio);
        } else {
          this.precioBase.set(0);
        }
        this.changeDetectorRef.detectChanges();
      });

    // Suscribirse a cambios en los impuestos para recalcular automáticamente
    const impuestosControl = this.detalles.at(this.formularioIndex)?.get('impuestos');
    if (impuestosControl) {
      impuestosControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          const precioActual = this.precioControl.value;
          if (precioActual && precioActual > 0) {
            this.calcularPrecioBase(precioActual);
            this.changeDetectorRef.detectChanges();
          }
        });
    }

    this.precioControl.setValue(precioInicial);

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  extraerPrecio(index: number) {
    const detalleFormGroup = this.detalles.at(index);
    const precio = this.precioControl.value;

    if (precio && precio > 0) {
      const precioBase = this.precioBase();
      detalleFormGroup.get('precio')?.setValue(precioBase.toFixed(2));
      this._formularioFacturaService.actualizarPrecioItem(index);
    }

    this._modalService.dismissAll();
  }

  private calcularPrecioBase(precio: number): void {
    const detalleFormGroup = this.detalles.at(this.formularioIndex);
    const impuestos = detalleFormGroup.get('impuestos')?.value;

    if (impuestos && impuestos.length > 0) {
      const precioSinIva = this.extraerTodosLosImpuestos(precio, impuestos);
      this.precioBase.set(Number(precioSinIva.toFixed(2)));
    } else {
      this.precioBase.set(precio);
    }
  }

  extraerTodosLosImpuestos(precio: number, impuestos: any[]): number {
    let precioActual = precio;

    // Aplicar cada impuesto en orden inverso (extraer en el orden opuesto a como se aplicaron)
    for (let i = impuestos.length - 1; i >= 0; i--) {
      const porcentaje = impuestos[i].porcentaje;
      precioActual = this.extraerIVA(
        precioActual,
        porcentaje,
        impuestos[i].porcentaje_base,
      );
    }

    return precioActual;
  }

  extraerIVA(precio: number, porcentajeIVA: number, base: number) {
    const aiu = base / 100; // base = porcentaje de AIU
    const ivaDecimal = (porcentajeIVA / 100) * aiu; // IVA real aplicado
    return precio / (1 + ivaDecimal);
  }

  recibirImpuestosModificados(
    impuestos: ImpuestoRespuestaConsulta[],
    indexFormulario: number,
  ) {
    this._formularioFacturaService.recibirImpuestosModificados(
      impuestos,
      indexFormulario,
    );
    
    // Recalcular precio base cuando cambian los impuestos
    const precioActual = this.precioControl.value;
    if (precioActual && precioActual > 0) {
      this.calcularPrecioBase(precioActual);
    }
    
    this.changeDetectorRef.detectChanges();
  }

  get detalles(): FormArray {
    return this.formularioFactura.get('detalles') as FormArray;
  }
}
