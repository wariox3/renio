import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { MovimientoService } from '@modulos/contabilidad/servicios/movimiento.service';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import { TituloAccionComponent } from '../../../../../../comun/componentes/titulo-accion/titulo-accion.component';
import { RegistroAutocompletarConComprobante } from '@interfaces/comunes/autocompletar/contabilidad/con-comprobante.interface';
import { RegistroAutocompletarConGrupo } from '@interfaces/comunes/autocompletar/contabilidad/con-grupo.interface';
import { GeneralService } from '@comun/services/general.service';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { Contacto } from '@interfaces/general/contacto';
import { CONTACTO_LISTA_BUSCAR_AVANZADO } from '@modulos/general/domain/mapeos/contacto.mapeo';
import ContactoFormularioComponent from '../../../../../general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import { CuentasComponent } from "@comun/componentes/cuentas/cuentas.component";
import { RegistroAutocompletarConCuenta } from '@interfaces/comunes/autocompletar/contabilidad/con-cuenta.interface';

@Component({
  selector: 'app-movimiento-detalle',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    TituloAccionComponent,
    NgbDropdownModule,
    BuscarAvanzadoComponent,
    ContactoFormularioComponent,
    CuentasComponent
],
  templateUrl: './movimiento-formulario.component.html',
})
export default class MovimientoFormularioComponent
  extends General
  implements OnInit
{
  formularioMovimiento: FormGroup;

  arrContactos: any[] = [];
  arrComprobantes: RegistroAutocompletarConComprobante[] = [];
  arrGrupo: RegistroAutocompletarConGrupo[] = [];

  public cuentaCodigo: string;
  public cuentaNombre: string;

  private readonly _generalService = inject(GeneralService);

  public campoListaContacto = CONTACTO_LISTA_BUSCAR_AVANZADO;

  constructor(
    private formBuilder: FormBuilder,
    private movimientoService: MovimientoService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();
    this.escucharNaturaleza();
    if (this.detalle) {
      this.consultarDetalle();
    }
  }

  iniciarFormulario() {
    this.formularioMovimiento = this.formBuilder.group(
      {
        numero: [
          null,
          Validators.compose([Validators.required, Validators.maxLength(200)]),
        ],
        fecha: [null, Validators.compose([Validators.required])],
        debito: [
          0,
          Validators.compose([Validators.required, Validators.min(0)]),
        ],
        credito: [
          0,
          Validators.compose([Validators.required, Validators.min(0)]),
        ],
        contacto: ['', Validators.compose([Validators.required])],
        contactoNombre: [''],
        comprobante: ['', Validators.compose([Validators.required])],
        comprobante_nombre: [''],
        grupo: [''],
        grupo_nombre: [''],
        documento: [null],
        naturaleza: ['D'],
        detalle: [null],
        base: [0],
        cuenta: [null, Validators.required],
        periodo: ['', Validators.compose([Validators.required])],        
      },
      {
        validators: this.validarDebitoCredito,
      },
    );
  }

  consultarCliente(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto>(
        'general/contacto/seleccionar/',
        { nombre_corto__icontains: `${event?.target.value}` },
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
          this.arrContactos = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    if (campo === 'contacto') {
      this.formularioMovimiento.get(campo)?.setValue(dato.id);
      this.formularioMovimiento
        .get('contactoNombre')
        ?.setValue(dato.nombre_corto);
    }

    if (campo === 'contacto-ver-mas') {
      this.formularioMovimiento.get('contacto')?.setValue(dato.id);
      this.formularioMovimiento
        .get('contactoNombre')
        ?.setValue(dato.nombre_corto);
    }

    this.changeDetectorRef.detectChanges();
  }

  consultarDetalle() {
    this.movimientoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.formularioMovimiento.patchValue({
          numero: respuesta.numero,
          fecha: respuesta.fecha,
          debito: respuesta.debito,
          credito: respuesta.credito,
          contacto: respuesta.contacto_id,
          contactoNombre: respuesta.contacto_nombre_corto,
          comprobante: respuesta.comprobante_id,
          comprobante_nombre: respuesta.comprobante_nombre,
          grupo: respuesta.grupo_id,
          grupo_nombre: respuesta.grupo_nombre,
          cuenta : respuesta.cuenta_id,
          cuenta_nombre: respuesta.cuenta_nombre,
          periodo: respuesta.periodo_id,
          detalle: respuesta.detalle,
          base: respuesta.base,
        });
        this.cuentaNombre = respuesta.cuenta_nombre;
        this.cuentaCodigo = respuesta.cuenta_codigo;
        this.changeDetectorRef.detectChanges();
      });
  }

  consultarInformacion() {
    zip(
      this._generalService.consultaApi<RegistroAutocompletarConComprobante>(
        'contabilidad/comprobante/seleccionar/',
      ),
      this._generalService.consultaApi<RegistroAutocompletarConGrupo>(
        'contabilidad/grupo/seleccionar/',
      ),
    ).subscribe((respuesta: any) => {
      this.arrComprobantes = respuesta[0];
      this.arrGrupo = respuesta[1];
      this.changeDetectorRef.detectChanges();
    });
  }

  formSubmit() {
    if (this.formularioMovimiento.valid) {
      if (this.detalle) {
        this.movimientoService
          .actualizarDatos(this.detalle, this.formularioMovimiento.value)
          .subscribe((respuesta) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.router.navigate(['contabilidad/especial/movimiento'], {
            });
            this.changeDetectorRef.detectChanges();
          });
      } else {
        this.movimientoService
          .guardarMovimiento(this.formularioMovimiento.value)
          .pipe(
            tap((respuesta: any) => {
              this.alertaService.mensajaExitoso('Se guardó la información');
              this.router.navigate(['contabilidad/especial/movimiento'], {
              });
            }),
          )
          .subscribe();
      }
    } else {
      this.formularioMovimiento.markAllAsTouched();
    }
  }

  actualizarNaturaleza() {
    const credito =
      Number(this.formularioMovimiento.get('credito')?.value) || 0;

    this.formularioMovimiento.patchValue(
      {
        naturaleza: credito > 0 ? 'C' : 'D',
      },
      { emitEvent: false },
    );
  }

  escucharNaturaleza() {
    this.formularioMovimiento
      .get('credito')
      ?.valueChanges.subscribe(() => this.actualizarNaturaleza());

    this.formularioMovimiento
      .get('debito')
      ?.valueChanges.subscribe(() => this.actualizarNaturaleza());
  }

  validarDebitoCredito(formulario: FormGroup) {
    const debito = Number(formulario.get('debito')?.value) || 0;
    const credito = Number(formulario.get('credito')?.value) || 0;

    if ((debito > 0 && credito > 0) || (debito === 0 && credito === 0)) {
      return {
        debitoCreditoInvalido: true,
      };
    }

    return null;
  }

  agregarCuentaGastoSeleccionado(cuenta: RegistroAutocompletarConCuenta) {
    this.cuentaNombre = cuenta.nombre;
    this.cuentaCodigo = cuenta.codigo;
    this.changeDetectorRef.detectChanges();
    this.formularioMovimiento.patchValue({
      cuenta: cuenta.id,
    });
  }

  limpiarCuentaGastoSeleccionado() { }


  abrirModalContactoNuevo(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  cerrarModal(contacto: Contacto) {
    this.modificarCampoFormulario('contacto', contacto);
    this.modalService.dismissAll();
  }

  navegarAtras() {
    this.router.navigate([`contabilidad/especial/movimiento`]);
  }
}
