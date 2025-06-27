import { CommonModule, NgFor } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  SimpleChanges,
  OnChanges,
  inject,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarConCuenta } from '@interfaces/comunes/autocompletar/contabilidad/con-cuenta.interface';
import { FiltrosAplicados } from '@interfaces/comunes/componentes/filtros/filtros-aplicados.interface';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { ParametrosFiltros } from '@interfaces/comunes/componentes/filtros/parametro-filtros.interface';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-comun-cuentas',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDropdownModule, NgFor],
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuentasComponent
  extends General
  implements AfterViewInit, OnChanges
{
  cuentaSeleccionada: any | null = null;
  arrCuentasLista: RegistroAutocompletarConCuenta[] = [];
  @Input() style: string = '';
  @Input() cuentaCodigo: string = '';
  @Input() cuentaNombre: string = '';
  @Input() documentoEnlazado: boolean;
  @Input() campoInvalido: any = false;
  @Input() iniciarFocusInputBusqueda: boolean = true;
  @Input() filtrosExternos: Filtros[];
  @Output() emitirArrCuentas: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;

  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cuentaCodigo?.currentValue !== null) {
      this.dropdown?.close();
    }
  }

  ngAfterViewInit() {
    if (this.iniciarFocusInputBusqueda) {
      if (this.inputItem?.nativeElement.value === '') {
        this.inputItem?.nativeElement.focus();
      }
    }
  }

  construirNombre() {
    const cuentaCodigo = this.cuentaCodigo || '';
    const cuentaNombre = this.cuentaNombre || '';

    if (!cuentaCodigo && !cuentaNombre) {
      return null;
    }

    return `${cuentaCodigo} ${cuentaNombre}`;
  }

  agregarCuenta(cuenta: any) {
    this.emitirArrCuentas.emit(cuenta);
  }

  consultarCuentas(event: any) {
    const valor = event?.target?.value;
    const valorBusqueda = valor.split(' ')?.[0] || '';
    this._generalService
      .consultaApi<RegistroAutocompletarConCuenta[]>(
        'contabilidad/cuenta/seleccionar/',
        {
          codigo__startswith: valorBusqueda,
          permite_movimiento: 'True',
        },
      )
      .subscribe((respuesta) => {
        this.arrCuentasLista = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosCuentas(event: any) {
    const valor = event?.target?.value;
    const valorCasteado = Number(valor);
    let filtros: { [key: string]: any } = {
      permite_movimiento: 'True',
    };

    if (!valor) {
      this.emitirLineaVacia.emit();
    }

    // la busqueda es por codigo
    if (!isNaN(valorCasteado)) {
      filtros = {
        ...filtros,
        codigo__startswith: `${valor}`,
      };
    } else {
      // la busqueda es por texto
      filtros = {
        ...filtros,
        nombre__icontains: `${valor}`,
      };
    }

    // if (this.filtrosExternos) {
    //   if (this.filtrosExternos.length) {
    //     filtros = [...filtros, ...this.filtrosExternos];
    //   }
    // }

    this._generalService
      .consultaApi<RegistroAutocompletarConCuenta>(
        'contabilidad/cuenta/seleccionar/',
        filtros,
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
          this.arrCuentasLista = respuesta;
          this.inputItem.nativeElement.focus();
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  onDropdownClose() {
    if (this.cuentaSeleccionada === null) {
      this.emitirLineaVacia.emit();
    }
  }
}
