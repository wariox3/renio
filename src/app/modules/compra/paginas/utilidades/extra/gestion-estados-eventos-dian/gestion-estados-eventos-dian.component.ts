import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { SoloNumerosDirective } from '@comun/directive/solo-numeros.directive';
import { TipoIdentificacion } from '@interfaces/general/tipo-identificacion.interface';
import { EventosDianService } from '@modulos/compra/servicios/eventos-dian.service';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  obtenerUsuarioApellido,
  obtenerUsuarioCargo,
  obtenerUsuarioNombre,
  obtenerUsuarioNumeroIdentificacion,
} from '@redux/selectors/usuario.selectors';
import { BehaviorSubject, finalize, tap, zip } from 'rxjs';

@Component({
  selector: 'app-gestion-estados-eventos-dian',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    SoloNumerosDirective,
  ],
  templateUrl: './gestion-estados-eventos-dian.component.html',
})
export class GestionEstadosEventosDianComponent
  extends General
  implements OnInit
{
  public formularioModal: FormGroup;
  public arrIdentificacion: TipoIdentificacion[] = [
    {
      identificacion_id: 13,
      identificacion_nombre: 'Cedula',
    },
  ];
  evento_id = 0;
  tituloModal: string;
  textoBtnOpenModal: string;
  textoBtnGuardarFormulario: string;
  visualizarBtnAbrirModal: boolean = true;
  visualizarBtnCargando$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @Input() documento: any;
  @Output() emitirConsultarLista: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private facturaService: FacturaService,
    private eventosDianService: EventosDianService
  ) {
    super();
  }

  ngOnInit(): void {
    if (
      this.documento.estado_electronico &&
      this.documento.evento_documento === 'PE'
    ) {
      this.tituloModal = 'Acuse de recibo de factura electrónica de venta';
      this.textoBtnOpenModal = 'Recibir documento';
      this.textoBtnGuardarFormulario = 'Confirmar recepción';
      this.evento_id = 30;
    } else if (
      this.documento.estado_electronico &&
      this.documento.evento_recepcion === 'PE'
    ) {
      this.tituloModal = 'Recibir bien o prestación de servicio';
      this.textoBtnOpenModal = '  Recibir bien / servicio';
      this.textoBtnGuardarFormulario = 'Recibir bien / servicio';
      this.evento_id = 32;
    } else if (
      this.documento.estado_electronico &&
      this.documento.evento_aceptacion === 'PE'
    ) {
      this.tituloModal = 'Acepción factura';
      this.textoBtnOpenModal = 'Aceptar factura';
      this.textoBtnGuardarFormulario = 'Aceptar factura';
      this.evento_id = 33;
    } else {
      this.visualizarBtnAbrirModal = false;
    }
  }

  emitir() {
    this.facturaService.emitir(this.documento.id).subscribe(() => {
      this.emitirConsultarLista.emit();
    });
  }

  abrirModal(content: any) {
    this._inicializarFormulario();
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });

    this.changeDetectorRef.detectChanges();
  }

  private _inicializarFormulario() {
    zip(
      this.store.select(obtenerUsuarioNombre),
      this.store.select(obtenerUsuarioApellido),
      this.store.select(obtenerUsuarioNumeroIdentificacion),
      this.store.select(obtenerUsuarioCargo)
    ).subscribe((respuesta) => {
      this.formularioModal = this.formBuilder.group({
        nombre: [respuesta[0], Validators.compose([Validators.required])],
        apellido: [respuesta[1], Validators.compose([Validators.required])],
        identificacion: [13, Validators.compose([Validators.required])],
        numero_identificacion: [
          respuesta[2],
          Validators.compose([Validators.required]),
        ],
        cargo: [respuesta[3], Validators.compose([Validators.required])],
        area: ['compras', Validators.compose([Validators.required])],
        id: [this.documento.id],
      });
    });
  }

  formSubmit() {
    if (this.formularioModal.valid) {
      this.visualizarBtnCargando$.next(true);

      let data = {
        ...this.formularioModal.value,
        ...{
          evento_id: this.evento_id,
        },
      };
      if (
        this.documento.evento_documento !== 'PE' &&
        this.documento.evento_recepcion !== 'PE'
      ) {
        data = {
          ...this.formularioModal.value,
          ...{
            evento_id: this.evento_id,
            estado_electronico_evento: false,
          },
        };
      }

      this.eventosDianService
        .emitirEvento(data)
        .pipe(
          tap((respuesta: any) => {
            this.alertaService.mensajaExitoso(
              this.translateService.instant('MENSAJES.EVENTOCOMPLEADO')
            );
            this.emitirConsultarLista.emit();
            this.modalService.dismissAll();
          }),
          finalize(() => {
            this.visualizarBtnCargando$.next(false);
            this.emitirConsultarLista.emit();
            this.modalService.dismissAll();
          })
        )
        .subscribe();
    } else {
      this.formularioModal.markAllAsTouched();
    }
  }
}
