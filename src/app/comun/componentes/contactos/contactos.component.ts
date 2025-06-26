import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { RegistroAutocompletarGenContacto } from '@interfaces/comunes/autocompletar/general/gen-contacto.interface';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { asyncScheduler, tap, throttleTime } from 'rxjs';

@Component({
  selector: 'app-comun-contactos',
  standalone: true,
  imports: [CommonModule, TranslateModule, NgbDropdownModule],
  templateUrl: './contactos.component.html',
  styleUrl: './contactos.component.scss',
})
export class ContactosComponent extends General {
  itemSeleccionado: any | null = null;
  arrContactos: any[];
  @Input() contactoNombre: string = '';
  @Input() estadoAprobado: false;
  @Input() campoInvalido: any = false;
  @Output() emitirContacto: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;

  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
  }

  validarValor() {
    if (this.inputItem.nativeElement.value === '') {
      this.emitirLineaVacia.emit(true);
    }
  }

  agregarContacto(item: any) {
    console.log(item);

    this.itemSeleccionado = item;
    this.contactoNombre = item.nombre_corto;
    this.emitirContacto.emit(item);
  }

  consultarContactos(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto>(
        'general/contacto/seleccionar/',
        { nombre_corto__icontains: `${event?.target.value}`, limint: 10 },
      )
      .subscribe((respuesta: any) => {
        this.arrContactos = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosContactos(event: any) {
    this._generalService
      .consultaApi<RegistroAutocompletarGenContacto>(
        'general/contacto/seleccionar/',
        { nombre_corto__icontains: `${event?.target.value}`, limint: 10 },
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta: any) => {
          this.arrContactos = respuesta;
          this.inputItem.nativeElement.focus();
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }
}
