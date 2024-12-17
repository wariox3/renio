import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { EncabezadoFormularioNuevoComponent } from '@comun/componentes/encabezado-formulario-nuevo/encabezado-formulario-nuevo.component';
import { HttpService } from '@comun/services/http.service';
import { CuentaBancoService } from '@modulos/general/servicios/cuenta-banco.service';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import { TituloAccionComponent } from "../../../../../comun/componentes/titulo-accion/titulo-accion.component";

@Component({
  selector: 'app-cuenta-banco-formulario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardComponent,
    NgbDropdownModule,
    NgSelectModule,
    EncabezadoFormularioNuevoComponent,
    TituloAccionComponent
],
  templateUrl: './cuenta-banco-formulario.component.html',
  styleUrl: './cuenta-banco-formulario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CuentaBancoFormularioComponent
  extends General
  implements OnInit
{
  formularioCuentaBanco: FormGroup;
  arrCuentasTipos: any[];
  arrCuentasBancos: any[];
  selectedDateIndex: number = -1;
  visualizarCampoNumeroCuenta = false;
  public ciudadDropdown: NgbDropdown;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private cuentaBancoService: CuentaBancoService
  ) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
    this.iniciarFormulario();

    if (this.detalle) {
      this.consultarDetalle();
    }

    this.formularioCuentaBanco
      .get('cuenta_banco_tipo')
      ?.valueChanges.subscribe((valor) => {
        this.modificarCampoFormulario('cuenta_banco_tipo', valor);
      });
  }

  consultarInformacion() {
    zip(
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
        {
          modelo: 'GenCuentaBancoTipo',
          serializador: 'ListaAutocompletar',
        }
      ),
      this.httpService.post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
        {
          modelo: 'GenCuentaBancoClase',
          serializador: 'ListaAutocompletar',
        }
      )
    ).subscribe((respuesta: any) => {
      this.arrCuentasTipos = respuesta[0].registros;
      this.arrCuentasBancos = respuesta[1].registros;
      this.changeDetectorRef.detectChanges();
    });
  }

  iniciarFormulario() {
    this.formularioCuentaBanco = this.formBuilder.group({
      nombre: [null, Validators.compose([Validators.required])],
      numero_cuenta: [null, Validators.compose([Validators.maxLength(50)])],
      cuenta_banco_tipo: [null, Validators.compose([Validators.required])],
      cuenta_banco_clase: ['', Validators.compose([Validators.required])],
    });
  }

  enviarFormulario() {
    if (this.formularioCuentaBanco.valid) {
      if (this.detalle) {
        this.cuentaBancoService
          .actualizarDatos(this.detalle, this.formularioCuentaBanco.value)
          .subscribe((respuesta: any) => {
            this.formularioCuentaBanco.patchValue({
              nombre_corto: respuesta.nombre_corto,
              celular: respuesta.celular,
              correo: respuesta.correo,
            });
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`/administrador/detalle`], {
                queryParams: {
                  ...parametro,
                  detalle: respuesta.id,
                },
              });
            });
          });
      } else {
        this.cuentaBancoService
          .guardarCuentaBanco(this.formularioCuentaBanco.value)
          .subscribe((respuesta: any) => {
            this.alertaService.mensajaExitoso('Se actualizó la información');
            this.activatedRoute.queryParams.subscribe((parametro) => {
              this.router.navigate([`/administrador/detalle`], {
                queryParams: {
                  ...parametro,
                  detalle: respuesta.id,
                },
              });
            });
          });
      }
    } else {
      this.formularioCuentaBanco.markAllAsTouched();
    }
  }

  consultarDetalle() {
    this.cuentaBancoService
      .consultarDetalle(this.detalle)
      .subscribe((respuesta: any) => {
        this.formularioCuentaBanco.patchValue({
          cuenta_banco_tipo: respuesta.cuenta_banco_tipo_id,
          cuenta_banco_clase: respuesta.cuenta_banco_clase_id,
          nombre: respuesta.nombre,
          numero_cuenta: respuesta.numero_cuenta,
        });

        if (respuesta.cuenta_banco_tipo_id !== 3) {
          this.visualizarCampoNumeroCuenta = true;
          this.formularioCuentaBanco
            .get('numero_cuenta')
            ?.setValidators([Validators.required]);
          this.formularioCuentaBanco
            .get('cuenta_banco_clase')
            ?.setValidators([Validators.required]);

          this.changeDetectorRef.detectChanges();
        } else {
          this.formularioCuentaBanco
            .get('cuenta_banco_clase')
            ?.clearValidators();
          this.formularioCuentaBanco
            .get('cuenta_banco_clase')
            ?.updateValueAndValidity();
          this.formularioCuentaBanco.get('numero_cuenta')?.clearValidators();
          this.formularioCuentaBanco
            .get('numero_cuenta')
            ?.updateValueAndValidity();
        }

        this.changeDetectorRef.detectChanges();
      });
  }

  consultarCiudad(event: any) {
    let arrFiltros = {
      filtros: [
        {
          operador: '__icontains',
          propiedad: 'nombre__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'GenCuentaBancoTipo',
      serializador: 'ListaAutocompletar',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/lista/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrCuentasTipos = respuesta.registros;
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  modificarCampoFormulario(campo: string, dato: any) {
    this.formularioCuentaBanco?.markAsDirty();
    this.formularioCuentaBanco?.markAsTouched();

    if (campo === 'cuenta_banco_tipo') {
      if (dato === null) {
        this.formularioCuentaBanco.get('cuenta_banco_tipo')?.setValue(null);
        this.visualizarCampoNumeroCuenta = false;
        this.changeDetectorRef.detectChanges();
      } else {
        if (dato !== 3) {
          this.visualizarCampoNumeroCuenta = true;
          this.formularioCuentaBanco
            .get('numero_cuenta')
            ?.setValidators([Validators.required]);
            this.formularioCuentaBanco
            .get('cuenta_banco_clase')
            ?.setValidators([Validators.required]);
          this.changeDetectorRef.detectChanges();
        } else {
          this.visualizarCampoNumeroCuenta = false;
          this.formularioCuentaBanco.get('numero_cuenta')?.clearValidators();
          this.formularioCuentaBanco
            .get('cuenta_banco_clase')
            ?.clearValidators();
          this.formularioCuentaBanco
            .get('numero_cuenta')
            ?.updateValueAndValidity();

          this.formularioCuentaBanco
            .get('numero_cuenta')
            ?.setValidators([Validators.maxLength(50)]);
          this.changeDetectorRef.detectChanges();
          this.formularioCuentaBanco.get('cuenta_banco_clase')?.setValue(null);
        }
      }
    }
    this.changeDetectorRef.detectChanges();
  }
}
