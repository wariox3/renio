import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Contacto } from '@interfaces/general/contacto';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import { BuscarAvanzadoComponent } from '@comun/componentes/buscar-avanzado/buscar-avanzado.component';
import { CampoLista } from '@interfaces/comunes/componentes/buscar-avanzado/buscar-avanzado.interface';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { RegistroAutocompletarGenMetodoPago } from '@interfaces/comunes/autocompletar/general/gen-metodo-pago.interface';
import { RegistroAutocompletarGenPlazoPago } from '@interfaces/comunes/autocompletar/general/gen-plazo-pago.interface';
import { RegistroAutocompletarGenAsesor } from '@interfaces/comunes/autocompletar/general/gen-asesor.interface';
import { RegistroAutocompletarGenSede } from '@interfaces/comunes/autocompletar/general/gen-sede.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import ContactDetalleComponent from '@modulos/general/paginas/contacto/contacto-formulario/contacto-formulario.component';
import ContactoFormularioComponent from '@modulos/general/paginas/contacto/contacto-formulario/contacto-formulario.component';

@Component({
  selector: 'app-factura-formulario-documento',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbDropdownModule,
    ContactoFormularioComponent,
    BuscarAvanzadoComponent,
    ContactDetalleComponent,
  ],
  templateUrl: 'factura-pos-electronica-formulario-documento.component.html',
  styleUrl: './factura-pos-electronica-formulario-documento.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaFormularioDocumentoComponent
  extends General
  implements OnInit
{
  @Input({ required: true }) formularioFactura!: FormGroup;
  @Input() visualizarCampoDocumentoReferencia: boolean = false;

  private _httpService = inject(HttpService);
  private _empresaService = inject(EmpresaService);
  private _modalService = inject(NgbModal);
  private readonly _generalService = inject(GeneralService);

  public plazo_pago_dias: any = 0;
  public arrMovimientosClientes: any[] = [];
  public arrMetodosPago: any[] = [];
  public arrPlazoPago: any[] = [];
  public arrAsesor: any[] = [];
  public arrSede: any[] = [];
  public requiereAsesor: boolean = false;
  public requiereSede: boolean = false;
  public camposBuscarAvanzado = [
    'id',
    'identificacion_abreviatura',
    'numero_identificacion',
    'nombre_corto',
  ];

  public campoListaContacto: CampoLista[] = [
    {
      propiedad: 'id',
      titulo: 'id',
      campoTipo: 'IntegerField',
    },
    {
      propiedad: 'numero_identificacion',
      titulo: 'identificacion',
      campoTipo: 'CharField',
    },
    {
      propiedad: 'nombre_corto',
      titulo: 'nombre_corto',
      campoTipo: 'CharField',
    },
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this._consultarInformacion();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    if (campo === 'contacto') {
      if (dato.id && dato.nombre_corto) {
        this.formularioFactura.get(campo)?.setValue(dato.id);
        this.formularioFactura
          .get('contactoNombre')
          ?.setValue(dato.nombre_corto);
      }
      this.formularioFactura.get('plazo_pago')?.setValue(dato.plazo_pago_id);
      if (dato.plazo_pago_dias > 0) {
        this.plazo_pago_dias = dato.plazo_pago_dias;
        const diasNumero = parseInt(this.plazo_pago_dias, 10) + 1;
        const fechaActual = new Date(); // Obtener la fecha actual
        fechaActual.setDate(fechaActual.getDate() + diasNumero);
        const fechaVencimiento = `${fechaActual.getFullYear()}-${(
          fechaActual.getMonth() + 1
        )
          .toString()
          .padStart(2, '0')}-${fechaActual
          .getDate()
          .toString()
          .padStart(2, '0')}`;
        // Suma los días a la fecha actual
        this.formularioFactura.get('fecha_vence')?.setValue(fechaVencimiento);
      }

      if (
        this.parametrosUrl?.documento_clase == 2 ||
        this.parametrosUrl?.documento_clase == 3
      ) {
        this.visualizarCampoDocumentoReferencia = true;
        this.changeDetectorRef.detectChanges();
      }
    }
    if (campo === 'metodo_pago') {
      this.formularioFactura.get(campo)?.setValue(dato.metodo_pago_id);
      this.formularioFactura
        .get('metodo_pago_nombre')
        ?.setValue(dato.metodo_pogo_nombre);
    }
    if (campo === 'comentario') {
      if (this.formularioFactura.get(campo)?.value === '') {
        this.formularioFactura.get(campo)?.setValue(null);
      }
    }
    if (campo === 'orden_compra') {
      if (this.formularioFactura.get(campo)?.value === '') {
        this.formularioFactura.get(campo)?.setValue(null);
      }
    }
    if (campo === 'documento_referencia') {
      this.formularioFactura.get(campo)?.setValue(dato.id);
      this.formularioFactura
        .get('documento_referencia_numero')
        ?.setValue(dato.numero);
    }
    this.changeDetectorRef.detectChanges();
  }

  consultarCliente(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto>(
        'general/contacto/seleccionar',
        {
          nombre_corto__icontains: `${event?.target.value}`,
          cliente: 'True',
          limit: 10,
        },
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
          this.arrMovimientosClientes = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  consultarDocumentoReferencia(event: any) {
    let arrFiltros = {
      filtros: [
        {
          propiedad: 'numero__icontains',
          valor1: `${event?.target.value}`,
        },
      ],
      limite: 5,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'Documento',
    };

    this._httpService
      .post<any>('general/documento/referencia/', {
        ...arrFiltros,
        contacto_id: this.formularioFactura.get('contacto')?.value,
        documento_clase_id: 1,
      })
      .pipe(
        throttleTime(600, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrMovimientosClientes = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  capturarDias(event: any) {
    // Obtener el valor del atributo data-dias del option seleccionado
    const fechaFactura = new Date(this.formularioFactura.get('fecha')?.value); // Crear objeto Date a partir del string
    this.plazo_pago_dias =
      event.target.selectedOptions[0].getAttribute('data-dias');

    const diasNumero = parseInt(this.plazo_pago_dias, 10);

    // Sumar los días a la fechde la factura
    fechaFactura.setDate(fechaFactura.getDate() + (diasNumero + 1));

    const fechaVencimiento = `${fechaFactura.getFullYear()}-${(
      fechaFactura.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaFactura.getDate().toString().padStart(2, '0')}`;
    // Suma los días a la fecha actual
    this.formularioFactura.get('fecha_vence')?.setValue(fechaVencimiento);
  }

  cambiarFechaVence(event: any) {
    const fechaFactura = new Date(this.formularioFactura.get('fecha')?.value); // Crear objeto Date a partir del string
    this.formularioFactura.get('plazo_pago')?.value;
    const diasNumero = parseInt(this.plazo_pago_dias, 10);
    // Sumar los días a la fechde la factura
    fechaFactura.setDate(fechaFactura.getDate() + (diasNumero + 1));
    const fechaVencimiento = `${fechaFactura.getFullYear()}-${(
      fechaFactura.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${fechaFactura.getDate().toString().padStart(2, '0')}`;

    // Suma los días a la fecha actual
    this.formularioFactura.get('fecha_vence')?.setValue(fechaVencimiento);
  }

  actualizarFormulario(dato: any, campo: string) {
    if (campo === 'contacto') {
      this.formularioFactura.get(campo)?.setValue(dato.id);
      this.formularioFactura.get('contactoNombre')?.setValue(dato.nombre_corto);
    }
    if (campo === 'documento_referencia') {
      this.formularioFactura.get(campo)?.setValue(dato.id);
    }

    this.formularioFactura?.markAsDirty();
    this.formularioFactura?.markAsTouched();
    this.changeDetectorRef.detectChanges();
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

  private _consultarInformacion() {
    zip(
      this._generalService.consultaApi<RegistroAutocompletarGenMetodoPago>(
        'general/metodo_pago/seleccionar/',
        {
          limit: 10,
        },
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenPlazoPago>(
        'general/plazo_pago/seleccionar/',
        {
          limit: 10,
        },
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenAsesor>(
        'general/asesor/seleccionar/',
        {
          limit: 10,
        },
      ),
      this._generalService.consultaApi<RegistroAutocompletarGenSede>(
        'general/sede/seleccionar/',
        {
          limit: 10,
        },
      ),
      this._empresaService.obtenerConfiguracionEmpresa(1),
    ).subscribe((respuesta: any) => {
      this.arrMetodosPago = respuesta[0];
      this.arrPlazoPago = respuesta[1];
      this.arrAsesor = respuesta[2];
      this.arrSede = respuesta[3];
      this.requiereAsesor = respuesta[4].venta_asesor;
      this.requiereSede = respuesta[4].venta_sede;
      this.changeDetectorRef.detectChanges();
    });
  }
}
