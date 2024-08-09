import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { HttpService } from '@comun/services/http.service';
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

  constructor(
    private httpService: HttpService,
    private modalService: NgbModal
  ) {
    super();
  }



  agregarContacto(item: any) {
    this.itemSeleccionado = item;
    this.contactoNombre = item.contacto_nombre_corto
    // if (this.campoInvalido) {
    //   this.campoInvalido = false;
    //   this.changeDetectorRef.detectChanges();
    // }

    // this.httpService
    //   .post<any>(`general/item/detalle/`, {})
    //   .subscribe((respuesta: any) => {
         this.emitirContacto.emit(item);
    //   });
  }

  consultarContactos(event: any) {
    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
        {
          filtros: [
            {
              id: '1692284537644-1688',
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
        }
      )
      .subscribe((respuesta) => {
        this.arrContactos = respuesta.registros;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosContactos(event: any) {
    this.httpService
      .post<{ cantidad_registros: number; registros: any[] }>(
        'general/funcionalidad/autocompletar/',
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
