import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  obtenerUsuarioId,
  obtenerUsuarioVrcredito,
  obtenerUsuarioVrSaldo,
} from '@redux/selectors/usuario.selectors';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-aplicar-credito',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './aplicar-credito.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AplicarCreditoComponent extends General implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _contenedorService = inject(ContenedorService);
  private readonly _modalService = inject(NgbModal);

  public formularioAplicarCredito: FormGroup;
  public vrCredito = signal(0);
  public vrSaldo = signal(0);
  public usuarioId = signal(0);
  @Input() movimientoId: number;
  @Output() emitirCreditoAplicado: EventEmitter<any> = new EventEmitter();
  private destroy$ = new Subject<void>();

  vrCampo = computed(() => {
    if (this.vrCredito() > this.vrSaldo()) {
      return this.vrSaldo();
    } else {
      return this.vrCredito();
    }
  });

  ngOnInit() {
    combineLatest([
      this.store.select(obtenerUsuarioVrcredito),
      this.store.select(obtenerUsuarioId),
      this.store.select(obtenerUsuarioVrSaldo),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([credito, codigo, saldo]) => {
        this.vrCredito.set(credito);
        this.usuarioId.set(codigo);
        this.vrSaldo.set(saldo);
      });

    this.inicializarFormulario();
  }

  inicializarFormulario() {
    this.formularioAplicarCredito = this._formBuilder.group({
      movimiento_id: this.movimientoId,
      valor: [
        this.vrCampo(),
        [
          Validators.required,
          Validators.min(1000),
          this.noMayorQue(this.vrSaldo()),
          this.noMayorQue(this.vrCredito()),
        ],
      ],
      usuario_id: this.usuarioId(),
    });
  }

  aplicarCredito() {
    if (this.formularioAplicarCredito.valid) {
      this._contenedorService
        .contenedorMovimientoAplicarFiltro(this.formularioAplicarCredito.value)
        .subscribe((respuesta) => {
          this.emitirCreditoAplicado.emit(true);
          this._modalService.dismissAll();
        });
    } else {
      this.formularioAplicarCredito.markAllAsTouched();
    }
  }

  // Validador personalizado para límite máximo
  noMayorQue(max: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value > max
        ? { maxExcedido: { valor: control.value, maxPermitido: max } }
        : null;
    };
  }
}
