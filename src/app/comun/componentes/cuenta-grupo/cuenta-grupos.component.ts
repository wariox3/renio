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
import { RegistroAutocompletarConGrupo } from '@interfaces/comunes/autocompletar/contabilidad/con-grupo.interface';
import { Filtros } from '@interfaces/comunes/componentes/filtros/filtros.interface';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-comun-grupos',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDropdownModule, NgFor],
  templateUrl: './cuenta-grupos.component.html',
  styleUrls: ['./cuenta-grupos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuentaGruposComponent
  extends General
  implements AfterViewInit, OnChanges
{
  grupoSeleccionada: any | null = null;
  arrGruposLista: RegistroAutocompletarConGrupo[] = [];
  @Input() style: string = '';
  @Input() grupoCodigo: string = '';
  @Input() grupoNombre: string = '';
  @Input() documentoEnlazado: boolean;
  @Input() campoInvalido: any = false;
  @Input() iniciarFocusInputBusqueda: boolean = true;
  @Input() filtrosExternos: Filtros[];
  @Output() emitirArrGrupos: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;

  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.grupoCodigo?.currentValue !== null) {
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
    const grupoCodigo = this.grupoCodigo || '';
    const grupoNombre = this.grupoNombre || '';

    if (!grupoCodigo && !grupoNombre) {
      return null;
    }

    return `${grupoCodigo} ${grupoNombre}`;
  }

  agregarGrupo(grupo: any) {
    this.emitirArrGrupos.emit(grupo);
  }

  consultarGrupos(event: any) {
    const valor = event?.target?.value;
    const valorBusqueda = valor.split(' ')?.[0] || '';
    this._generalService
      .consultaApi<RegistroAutocompletarConGrupo[]>(
        'contabilidad/cuenta_grupo/seleccionar/',
        {
          codigo__startswith: valorBusqueda
        },
      )
      .subscribe((respuesta) => {
        this.arrGruposLista = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosGrupos(event: any) {
    const valor = event?.target?.value;
    const valorCasteado = Number(valor);
    let filtros: { [key: string]: any } = {
      
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
      .consultaApi<RegistroAutocompletarConGrupo>(
        'contabilidad/cuenta_grupo/seleccionar/',
        filtros,
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
          this.arrGruposLista = respuesta;
          this.inputItem.nativeElement.focus();
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  onDropdownClose() {
    if (this.grupoSeleccionada === null) {
      this.emitirLineaVacia.emit();
    }
  }
}
