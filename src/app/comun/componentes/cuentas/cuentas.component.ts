import { CommonModule, NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { Item } from '@interfaces/general/item';
import { TranslationModule } from '@modulos/i18n';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-comun-cuentas',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TranslationModule,
    NgbDropdownModule,
    NgFor,
  ],
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuentasComponent extends General implements AfterViewInit {

  cuentaSeleccionada: any | null = null;
  arrCuentasLista: any[];
  @Input() cuentaCodigo: string = '';
  @Input() documentoEnlazado: boolean;
  @Input() campoInvalido: any  = false;
  @Output() emitirArrCuentas: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;

  constructor(private httpService: HttpService) {
    super();
  }

  ngAfterViewInit() {
    if (this.inputItem?.nativeElement.value === '') {
      this.inputItem?.nativeElement.focus();
    }
  }

  agregarCuenta(cuenta: any) {
    this.cuentaSeleccionada = cuenta;
    if(this.campoInvalido){
      this.campoInvalido = false
      this.changeDetectorRef.detectChanges()
    }else {
      this.emitirArrCuentas.emit(cuenta);
    }
  }

  consultarCuentas(event: any) {
    let arrFiltros = {
      filtros: [
        {
          id: '1692284537644-1688',
          operador: '__icontains',
          propiedad: 'codigo__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'Cuenta',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: Item[] }>(
        'general/funcionalidad/lista-autocompletar/',
        arrFiltros
      )
      .subscribe((respuesta) => {
        this.arrCuentasLista = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosCuentas(event: any) {
    let arrFiltros = {
      filtros: [
        {
          id: '1692284537644-1688',
          operador: '__icontains',
          propiedad: 'codigo__icontains',
          valor1: `${event?.target.value}`,
          valor2: '',
        },
      ],
      limite: 10,
      desplazar: 0,
      ordenamientos: [],
      limite_conteo: 10000,
      modelo: 'Cuenta',
    };

    this.httpService
      .post<{ cantidad_registros: number; registros: Item[] }>(
        'general/funcionalidad/lista-autocompletar/',
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
    if(this.cuentaSeleccionada === null){
      this.emitirLineaVacia.emit();
    }
  }

 }
