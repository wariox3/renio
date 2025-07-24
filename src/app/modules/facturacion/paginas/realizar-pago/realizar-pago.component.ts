import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardComponent } from '@comun/componentes/card/card.component';
import { AlertaService } from '@comun/services/alerta.service';
import { environment } from '@env/environment';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { FacturacionService } from '@modulos/facturacion/servicios/facturacion.service';
import { Store } from '@ngrx/store';
import { usuarioActionActualizarVrSaldo } from '@redux/actions/usuario.actions';
import { obtenerUsuarioId, obtenerUsuarioVrAbono } from '@redux/selectors/usuario.selectors';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';

@Component({
  selector: 'app-realizar-pago',
  standalone: true,
  imports: [CardComponent, FormsModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './realizar-pago.component.html',
  styleUrls: ['./realizar-pago.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealizarPagoComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private renderer = inject(Renderer2);
  private contenedorService = inject(ContenedorService);
  private facturacionService = inject(FacturacionService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private alertaService = inject(AlertaService);

  // Form controls
  pagoForm!: FormGroup;
  estimatedAmount = signal(0);
  vrAbonos = signal(0);
  usuarioId: number = 0;

  // Wompi related properties
  wompiHash: string = '';
  wompiReferencia: string = '';
  wompiSubscription: Subscription | null = null;
  private _unsubscribe$ = new Subject<void>();

  ngOnInit(): void {
    this.initForm();
    this.store.select(obtenerUsuarioId).subscribe((id) => {
      this.usuarioId = id;
    });
    this.store.select(obtenerUsuarioVrAbono).subscribe((abono) => {
      this.vrAbonos.set(abono);
      console.log(this.vrAbonos());
    });
    this.consultarValorEstimado(this.usuarioId);
  }

  ngOnDestroy(): void {
    // Cleanup subscriptions
    if (this.wompiSubscription) {
      this.wompiSubscription.unsubscribe();
      this.wompiSubscription = null;
    }

    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  private consultarValorEstimado(usuarioId: number) {
    const hoy = new Date();
    const fechaHasta = hoy.toISOString().slice(0, 10);
    this.facturacionService
      .facturacionFechas(usuarioId, fechaHasta)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((respuesta) => {
        let totalConsumo = 0;

        if(this.vrAbonos() <= respuesta.total_consumo){
          totalConsumo = respuesta.total_consumo - this.vrAbonos()
        }
        
        this.estimatedAmount.set(totalConsumo);
        this.updateFormWithEstimatedAmount();
        setTimeout(() => {
          this.generateWompiReference();
        }, 500);
      });
  }

  private initForm(): void {
    this.pagoForm = this.fb.group({
      paymentType: ['estimated', Validators.required],
      customAmount: [0, [Validators.required, Validators.min(1)]],
    });

    // Suscribirse a los cambios en el valor personalizado
    this.pagoForm
      .get('customAmount')
      ?.valueChanges.pipe(
        takeUntil(this._unsubscribe$),
        distinctUntilChanged(),
        debounceTime(500),
      )
      .subscribe(() => {
        if (this.paymentType === 'custom' && this.pagoForm.valid) {
          this.generateWompiReference();
        }
      });
  }

  get paymentType(): string {
    return this.pagoForm.get('paymentType')?.value;
  }

  get customAmount(): number {
    return this.pagoForm.get('customAmount')?.value;
  }

  get customAmountControl() {
    return this.pagoForm.get('customAmount');
  }

  onPaymentTypeChange(type: string): void {
    this.pagoForm.patchValue({
      paymentType: type,
    });

    // Update Wompi button when payment type changes
    this.generateWompiReference();
  }

  /**
   * Generates a unique reference for the Wompi payment
   * and requests a hash for integrity validation
   */
  generateWompiReference(): void {
    if (!this.pagoForm.valid) {
      return;
    }

    const amount =
      this.paymentType === 'estimated'
        ? this.estimatedAmount()
        : this.customAmount;

    if (amount <= 0) {
      return;
    }

    // Generate a unique reference using timestamp and user ID
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    const seconds = String(today.getSeconds()).padStart(2, '0');
    const dateFormat = `${year}${month}${day}${hours}${minutes}${seconds}`;
    const reference = `A${this.usuarioId}-${dateFormat}`;

    console.log(reference);

    // Request hash from backend
    this.contenedorService
      .contenedorGenerarIntegridad({
        referencia: reference,
        monto: `${amount}00`, // Convert to cents
      })
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response) => {
        this.wompiHash = response.hash;
        this.wompiReferencia = reference;
        this.actualizarBotonWompi();
        this.changeDetectorRef.detectChanges();
      });
  }

  /**
   * Updates the Wompi payment button in the DOM
   */
  actualizarBotonWompi(): void {
    const wompiWidget = document.getElementById('wompiWidget');
    if (!wompiWidget) {
      console.error('Elemento wompiWidget no encontrado');
      return;
    }

    // Clear the container
    wompiWidget.innerHTML = '';

    // Get payment amount based on selected payment type
    const amount =
      this.paymentType === 'estimated'
        ? this.estimatedAmount()
        : this.customAmount;

    // Only create the button if there's an amount to pay and we have hash and reference
    if (amount > 0 && this.wompiHash && this.wompiReferencia) {
      // Get redirect URL based on environment
      const url = environment.production
      ? `${environment.dominioHttp}://app${environment.dominioApp}/facturacion`
      : 'http://localhost:4200/facturacion';

      // Create script element for Wompi widget
      const script = this.renderer.createElement('script');

      // Set attributes for the Wompi script
      const attributes = {
        src: 'https://checkout.wompi.co/widget.js',
        'data-render': 'button',
        'data-public-key': environment.llavePublica,
        'data-currency': 'COP',
        'data-amount-in-cents': `${amount}00`, // Convert to cents
        'data-redirect-url': url,
        'data-reference': this.wompiReferencia,
        'data-signature:integrity': this.wompiHash,
      };

      // Apply attributes to the script
      Object.entries(attributes).forEach(([key, value]) => {
        this.renderer.setAttribute(script, key, value);
      });

      // Add the script to the container
      this.renderer.appendChild(wompiWidget, script);
    }
  }

  /**
   * Updates the user's balance after a payment is made
   */
  actualizarPago(): void {
    this.facturacionService
      .obtenerUsuarioVrSaldo(this.usuarioId)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((respuesta) => {
        this.store.dispatch(
          usuarioActionActualizarVrSaldo({
            vr_saldo: respuesta.saldo,
          }),
        );
        this.changeDetectorRef.detectChanges();
      });
  }

  /**
   * Processes the payment when the form is submitted
   */
  procesarPago(): void {
    if (!this.pagoForm.valid) {
      this.alertaService.mensajeError(
        'Error',
        'Por favor, complete correctamente el formulario de pago',
      );
      return;
    }

    this.generateWompiReference();
  }

  private updateFormWithEstimatedAmount(): void {
    if (!this.pagoForm) return;

    // Actualizar el valor personalizado con el valor estimado
    this.pagoForm.patchValue({
      customAmount: this.estimatedAmount(),
    });

    // Obtener el control customAmount
    const customAmountControl = this.pagoForm.get('customAmount');
    if (!customAmountControl) return;

    // Aplicar los validadores directamente al control, no al formulario completo
    customAmountControl.setValidators([
      Validators.required,
      Validators.min(1),
    ]);

    // Actualizar la validez del control después de cambiar los validadores
    customAmountControl.updateValueAndValidity();
  }
}
