import { CommonModule, NgFor } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarGenResolucion } from '@interfaces/comunes/autocompletar/general/gen-resolucion.interface';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-seleccionar-resolucion',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDropdownModule, NgFor],
  templateUrl: './seleccionar-resolucion.component.html',
  styleUrls: ['./seleccionar-resolucion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeleccionarResolucionComponent
  extends General
  implements AfterViewInit, OnChanges
{
  itemSeleccionado: RegistroAutocompletarGenResolucion | null = null;
  resoluciones: RegistroAutocompletarGenResolucion[] = [];
  @Input() style: string = '';
  @Input() valorInicial: string = '';
  @Input() documentoEnlazado: boolean;
  @Input() campoInvalido: any = false;
  @Input() iniciarFocusInputBusqueda: boolean = true;
  @Input() filtrosExternos: { [key: string]: any } = {}
  @Output()
  itemSeleccionadoEvent: EventEmitter<RegistroAutocompletarGenResolucion | null> =
    new EventEmitter();
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
    if (!this.valorInicial) {
      return null;
    }

    return this.valorInicial;
  }

  agregar(item: RegistroAutocompletarGenResolucion) {
    this.itemSeleccionadoEvent.emit(item);
  }

  consultarCuentas(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenResolucion[]>(
        'general/resolucion/seleccionar/',
         this.filtrosExternos,
      )
      .subscribe((respuesta) => {
        this.resoluciones = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosCuentas(event: any) {
    const valor = event?.target?.value;
    const valorCasteado = Number(valor);
    let filtros: { [key: string]: any } = {};

    if (valorCasteado) {
      filtros = {
        numero__icontains: valorCasteado,
      };
    }

    if (!valor) {
      this.itemSeleccionadoEvent.emit(null);
    }

    if (this.filtrosExternos) {
      if (Object.keys(this.filtrosExternos).length) {
        filtros = { ...filtros, ...this.filtrosExternos };
      }
    }

    this._generalService
      .consultaApi<RegistroAutocompletarGenResolucion[]>(
        'general/resolucion/seleccionar/',
        filtros,
      )
      .pipe(
        tap((respuesta) => {
          this.resoluciones = respuesta;
          this.inputItem.nativeElement.focus();
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  onDropdownClose() {
    if (this.itemSeleccionado === null) {
      this.emitirLineaVacia.emit();
    }
  }
}
