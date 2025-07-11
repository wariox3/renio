import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { FormularioProductosComponent } from '@comun/componentes/factura/components/formulario-productos/formulario-productos.component';
import { TituloAccionComponent } from '@comun/componentes/titulo-accion/titulo-accion.component';
import { ConfigModuleService } from '@comun/services/application/config-modulo.service';
import { FechasService } from '@comun/services/fechas.service';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import { Contacto } from '@interfaces/general/contacto';
import { Rutas } from '@interfaces/menu/configuracion.interface';
import { CONTACTO_FILTRO_PERMANENTE_CLIENTE, CONTACTO_LISTA_BUSCAR_AVANZADO } from '@modulos/general/domain/mapeos/contacto.mapeo';
import ContactoFormularioComponent from '@modulos/general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import { FacturaService } from '@modulos/venta/servicios/factura.service';
import {
  NgbDropdownModule,
  NgbModal,
  NgbNavModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pedido-cliente-formulario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    EncabezadoFormularioNuevoComponent,
    CardComponent,
    TituloAccionComponent,
    BuscarAvanzadoComponent,
    TranslateModule,
    NgbDropdownModule,
    NgbNavModule,
    FormularioProductosComponent,
    ContactoFormularioComponent,
  ],
  templateUrl: './pedido-cliente-formulario.component.html',
  styleUrl: './pedido-cliente-formulario.component.css',
})
export default class PedidoClienteFormularioComponent
  extends General
  implements OnInit, OnDestroy
{
  private _generalService = inject(GeneralService);
  private _facturaService = inject(FacturaService);
  private _formBuilder = inject(FormBuilder);
  private _fechasService = inject(FechasService);
  private _modalService = inject(NgbModal);
  private _rutas: Rutas | undefined;
  private _destroy$ = new Subject<void>();
  private readonly _configModuleService = inject(ConfigModuleService);

  public active = signal(1);
  formularioPedido: FormGroup;
  clientes = signal<RegistroAutocompletarGenContacto[]>([]);
  public _modulo: string;
  public campoListaContacto = CONTACTO_LISTA_BUSCAR_AVANZADO;
  public filtrosPermanentes = CONTACTO_FILTRO_PERMANENTE_CLIENTE;

  ngOnInit() {
    this.initFormualrio();
    this._configurarModuleListener();
    if (this.detalle) {
      this.consultarDetalle();
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.unsubscribe();
  }

  private consultarDetalle() {
    this._facturaService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta) => {
        this.formularioPedido.patchValue({
          contacto: respuesta.documento.contacto_id,
          contactoNombre: respuesta.documento.contacto_nombre_corto,
          fecha: respuesta.documento.fecha,
          documento_tipo: respuesta.documento.documento_tipo_id,
        });
      });
  }

  initFormualrio() {
    this.formularioPedido = this._formBuilder.group({
      contacto: ['', [Validators.required]],
      contactoNombre: [''],
      fecha: [
        this._fechasService.getFechaVencimientoInicial(),
        Validators.required,
      ],
      empresa: [1],
      documento_tipo: [26],
    });
  }

  private _configurarModuleListener() {
    this._configModuleService.currentModelConfig$
      .pipe(takeUntil(this._destroy$))
      .subscribe((modeloConfig) => {
        this._rutas = modeloConfig?.ajustes.rutas;
        this._modulo = this._configModuleService.modulo() || '';
      });
  }

  formSubmit() {
    this.guardarActualizarDocumento();
  }

  guardarDocumento() {
    this._facturaService
      .guardarFactura(this.formularioPedido.value)
      .subscribe((respuesta) => {
        this.router.navigate(
          [`${this._rutas?.editar}/${respuesta.documento.id}`],
          {
            queryParams: {
              ...this.parametrosUrl,
            },
          },
        );
      });
  }

  actualizarDocumento() {
    this._facturaService
      .actualizarDocumento(this.detalle, this.formularioPedido.value)
      .subscribe((respuesta) => {
        console.log(respuesta);
      });
  }

  guardarActualizarDocumento() {
    if (this.detalle) {
      this.actualizarDocumento();
    } else {
      this.guardarDocumento();
    }
  }

  modificarCampoFormulario(campo: string, valor: any) {
    if (campo === 'cliente') {
      this.formularioPedido.get('contacto')?.setValue(valor.id);
      this.formularioPedido.get('contactoNombre')?.setValue(valor.nombre_corto);
    }
  }

  abrirModalContactoNuevo(content: any) {
    this._modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'xl',
    });
  }

  cerrarModal(contacto: Contacto) {
    this.modificarCampoFormulario('contacto', contacto);
    this._modalService.dismissAll();
  }

  consultarCliente(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto>(
        'general/contacto/seleccionar/',
        {
          nombre_corto__icontains: `${event?.target.value}`,
          cliente: 'True',
          limit: 10,
        },
      )
      .subscribe((respuesta: any) => {
        this.clientes.set(respuesta);
      });
  }
}
