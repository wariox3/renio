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
  monthsArray = Array.from({length: 12}, (_, i) => i + 1); // Array del 1 al 12
  calculatedAmount = signal(0);
  informacionFacturacionId: any;

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
    });
    
    // Subscribe to the informacionFacturacionId Observable
    this.facturacionService.informacionFacturacionId$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(id => {
        this.informacionFacturacionId = id;
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
      months: [12, [Validators.required, Validators.min(1), Validators.max(12)]],
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
        if (this.paymentType !== 'custom' || !this.pagoForm.valid) return;
        this.generateWompiReference();
      });
      
    // Actualizar el monto calculado cuando cambie el número de meses
    this.updateCalculatedAmount();
  }

  get paymentType(): string {
    return this.pagoForm?.get('paymentType')?.value || 'estimated';
  }

  get customAmount(): number {
    return this.pagoForm?.get('customAmount')?.value || 0;
  }
  
  get months(): number {
    return this.pagoForm?.get('months')?.value || 1;
  }

  get customAmountControl() {
    return this.pagoForm?.get('customAmount');
  }

  onPaymentTypeChange(type: string): void {
    if (!this.pagoForm) return;
    
    this.pagoForm.patchValue({
      paymentType: type,
    });
    
    // Actualizar el monto calculado si es pago por múltiples meses
    if (type === 'multiMonth') {
      this.updateCalculatedAmount();
    }

    // Update Wompi button when payment type changes
    this.generateWompiReference();
  }
  
  onMonthsChange(): void {
    if (!this.pagoForm) return;
    
    this.updateCalculatedAmount();
    this.generateWompiReference();
  }
  
  private updateCalculatedAmount(): void {
    const baseAmount = this.estimatedAmount();
    const months = this.months;
    
    this.calculatedAmount.set(baseAmount * months);
  }

  /**
   * Generates a unique reference for the Wompi payment
   * and requests a hash for integrity validation
   */
  generateWompiReference(): void {
    // Verificar que el formulario sea válido
    if (!this.pagoForm?.valid) {
      console.log('Formulario inválido, no se generará referencia Wompi');
      return;
    }

    // Obtener el monto según el tipo de pago
    let amount = 0;
    
    if (this.paymentType === 'estimated') {
      amount = this.estimatedAmount();
    } else if (this.paymentType === 'multiMonth') {
      amount = this.calculatedAmount();
    } else if (this.paymentType === 'custom') {
      amount = this.customAmount;
    }

    // Verificar que el monto sea válido
    if (!amount || amount <= 0) {
      console.log('Monto inválido:', amount);
      return;
    }

    // Verificar que tengamos un ID de usuario
    if (!this.usuarioId) {
      console.log('ID de usuario no disponible');
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
    const reference = `A${this.usuarioId}-${this.informacionFacturacionId}-${dateFormat}`;
    console.log(reference);

    // Request hash from backend
    this.contenedorService
      .contenedorGenerarIntegridad({
        referencia: reference,
        monto: `${amount}00`, // Convert to cents
      })
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe({
        next: (response) => {
          if (!response || !response.hash) {
            console.error('Respuesta inválida al generar hash');
            return;
          }
          
          this.wompiHash = response.hash;
          this.wompiReferencia = reference;
          this.actualizarBotonWompi();
          this.changeDetectorRef.detectChanges();
        },
        error: (err) => {
          console.error('Error al generar hash para Wompi:', err);
          this.alertaService.mensajeError(
            'Error',
            'No se pudo generar el hash para el pago. Por favor, intente nuevamente.'
          );
        }
      });
  }

  /**
   * Updates the Wompi payment button in the DOM
   */
  actualizarBotonWompi(): void {
    // Verificar que existe el contenedor del widget
    const wompiWidget = document.getElementById('wompiWidget');
    if (!wompiWidget) {
      console.error('Elemento wompiWidget no encontrado en el DOM');
      return;
    }

    // Limpiar el contenedor
    wompiWidget.innerHTML = '';

    // Obtener el monto según el tipo de pago
    let amount = 0;
    
    if (this.paymentType === 'estimated') {
      amount = this.estimatedAmount();
    } else if (this.paymentType === 'multiMonth') {
      amount = this.calculatedAmount();
    } else if (this.paymentType === 'custom') {
      amount = this.customAmount;
    }

    // Verificar que tenemos todos los datos necesarios
    if (amount <= 0) {
      console.error('Monto inválido para Wompi:', amount);
      return;
    }
    
    if (!this.wompiHash) {
      console.error('Hash de Wompi no disponible');
      return;
    }
    
    if (!this.wompiReferencia) {
      console.error('Referencia de Wompi no disponible');
      return;
    }
    
    try {
      // Obtener la URL de redirección según el entorno
      const url = environment.production
        ? `${environment.dominioHttp}://app${environment.dominioApp}/facturacion`
        : 'http://localhost:4200/facturacion';
  
      // Crear el elemento script para el widget de Wompi
      const script = this.renderer.createElement('script');
  
      // Establecer los atributos para el script de Wompi
      const attributes = {
        src: 'https://checkout.wompi.co/widget.js',
        'data-render': 'button',
        'data-public-key': environment.llavePublica,
        'data-currency': 'COP',
        'data-amount-in-cents': `${amount}00`, // Convertir a centavos
        'data-redirect-url': url,
        'data-reference': this.wompiReferencia,
        'data-signature:integrity': this.wompiHash,
      };
  
      // Aplicar los atributos al script
      Object.entries(attributes).forEach(([key, value]) => {
        this.renderer.setAttribute(script, key, value);
      });
  
      // Añadir el script al contenedor
      this.renderer.appendChild(wompiWidget, script);
      console.log('Botón Wompi actualizado correctamente');
    } catch (error) {
      console.error('Error al crear el botón de Wompi:', error);
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
