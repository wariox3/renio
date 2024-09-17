import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
import { AutocompletarRegistros, RegistroAutocompletarContacto } from '@interfaces/comunes/autocompletar';
import { NgbDropdownModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  @Input() estado_aprobado: false;
  @Input() campoInvalido: any = false;
  @Output() emitirContacto: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;

  constructor(private httpService: HttpService) {
    super();
  }

  agregarContacto(item: any) {
    this.itemSeleccionado = item;
    this.contactoNombre = item.contacto_nombre_corto
    this.emitirContacto.emit(item);
  }

  consultarContactos(event: any) {
    this.httpService
      .post<AutocompletarRegistros<RegistroAutocompletarContacto>>(
        'general/funcionalidad/lista/',
        {
          filtros: [
            {
              operador: '__icontains',
              propiedad: 'nombre_corto__icontains',
              valor1: `${event?.target.value}`,
              valor2: '',
            },
          ],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenContacto',
          serializador: "ListaAutocompletar"
        }
      )
      .subscribe((respuesta) => {
        this.arrContactos = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosContactos(event: any) {
    this.httpService
      .post<AutocompletarRegistros<RegistroAutocompletarContacto>>(
        'general/funcionalidad/lista/',
        {
          filtros: [
            {
              operador: '__icontains',
              propiedad: 'nombre_corto__icontains',
              valor1: `${event?.target.value}`,
              valor2: '',
            },
          ],
          limite: 10,
          desplazar: 0,
          ordenamientos: [],
          limite_conteo: 10000,
          modelo: 'GenContacto',
          serializador: "ListaAutocompletar"
        }
      )
      .pipe(
        throttleTime(300, asyncScheduler, { leading: true, trailing: true }),
        tap((respuesta) => {
          this.arrContactos = respuesta.registros;
          this.inputItem.nativeElement.focus();
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }
}
