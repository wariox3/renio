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
} from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@interfaces/general/item';

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
  arrCuentasLista: any[];
  @Input() cuentaCodigo: string = '';
  @Input() cuentaNombre: string = '';
  @Input() documentoEnlazado: boolean;
  @Input() campoInvalido: any = false;
  @Output() emitirArrCuentas: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;

  constructor(private httpService: HttpService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cuentaCodigo?.currentValue !== null) {
      this.dropdown?.close();
    }
  }

  ngAfterViewInit() {
    if (this.inputItem?.nativeElement.value === '') {
      this.inputItem?.nativeElement.focus();
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
    // this.cuentaSeleccionada = cuenta;
    // if(this.campoInvalido){
    //   this.campoInvalido = false
    //   this.changeDetectorRef.detectChanges()
    // }else {
    this.emitirArrCuentas.emit(cuenta);
    //}
  }

  consultarCuentas(event: any) {
    const valor = event?.target?.value;
    const valorBusqueda = valor.split(' ')?.[0] || '';

    let arrFiltros = {
      filtros: [
        {
          propiedad: 'codigo__startswith',
          valor1: `${valorBusqueda}`,
        },
        {
          propiedad: 'permite_movimiento',
          valor1: true,
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'ConCuenta',
      serializador: 'ListaAutocompletar',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: Item[] }>(
        'general/funcionalidad/lista/',
        arrFiltros
      )
      .subscribe((respuesta) => {
        this.arrCuentasLista = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosCuentas(event: any) {
    const valor = event?.target?.value;
    const valorCasteado = Number(valor);
    const filtros = [];

    // la busqueda es por codigo
    if (!isNaN(valorCasteado)) {
      filtros.push({
        propiedad: 'codigo__startswith',
        valor1: `${valor}`,
      });
    } else {
      // la busqueda es por texto
      filtros.push({
        propiedad: 'nombre__icontains',
        valor1: `${valor}`,
      });
    }

    let arrFiltros = {
      filtros: [
        {
          propiedad: 'permite_movimiento',
          valor1: true,
        },
        ...filtros,
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'ConCuenta',
      serializador: 'ListaAutocompletar',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: Item[] }>(
        'general/funcionalidad/lista/',
        arrFiltros
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrCuentasLista = respuesta.registros;
          this.inputItem.nativeElement.focus();
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  onDropdownClose() {
    if (this.cuentaSeleccionada === null) {
      this.emitirLineaVacia.emit();
    }
  }
}
