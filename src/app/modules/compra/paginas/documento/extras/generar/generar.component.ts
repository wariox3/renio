import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { ModalDinamicoService } from '@comun/services/modal-dinamico.service';
import { ModeloConfig } from '@interfaces/menu/configuracion.interface';
import { ExtraService } from '@modulos/venta/servicios/extra.service';
import { TranslateModule } from '@ngx-translate/core';
import { finalize, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-generar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './generar.component.html',
  styleUrl: './generar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GenerarComponent extends General implements OnInit {
  private extraService = inject(ExtraService);
  private modalDinamicoService = inject(ModalDinamicoService);
  @Output() emitirConsultaLista: EventEmitter<any> = new EventEmitter();

  public formularioVentaFacturaElectronica: FormGroup;
  public generando: boolean = false;
  public queryParams: { [key: string]: any } = {};

  private _configModuleService = inject(ConfigModuleService);
  private _destroy$ = new Subject<void>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this._setupConfigModuleListener();
    this.confirmarGenerar();
  }

  private _setupConfigModuleListener() {
    this._configModuleService.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((value) => {
        this._loadModuleConfiguration(value);
      });
  }

  private _loadModuleConfiguration(modeloConfig: ModeloConfig | null) {
    this.queryParams = modeloConfig?.ajustes.queryParams || {};
  }

  confirmarGenerar() {
    this.alertaService.confirmar({
      titulo: '¿Estas seguro de generar?',
      texto: 'Esta acción no se puede revertir.',
      textoBotonCofirmacion: 'Si, generar',
    }).then((respuesta) => {
      if (respuesta.isConfirmed) {
        this.formSubmit();
      }
    });
  }

  formSubmit() {
    this.generando = true;
    this.extraService
      .generarMasivo({ documento_tipo_id: this.queryParams?.documento_tipo_id })
      .pipe(
        finalize(() => {
          this.generando = false;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe((respuesta) => {
        this.alertaService.mensajaExitoso(
          '¡Facturas electrónicas generadas exitosamente!',
        );
        this.modalDinamicoService.emitirEvento(true);
      });
  }
}
