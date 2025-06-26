import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { General } from '@comun/clases/general';
import { GeneralService } from '@comun/services/general.service';
import { ItemSeleccionar } from '@interfaces/general/item.interface';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-comun-cuenta-banco',
  standalone: true,
  templateUrl: './cuenta-banco.component.html',
  styleUrls: ['./cuenta-banco.component.scss'],
  imports: [
    TranslateModule,
    NgbDropdownModule,
    CommonModule,
  ],
})
export class CuentaBancoComponent extends General implements AfterViewInit {
  itemSeleccionado: any | null = null;
  arrItemsLista: ItemSeleccionar[];
  @Input() itemNombre: string = '';
  @Input() estado_aprobado: boolean = false;
  @Input() campoInvalido: any = false;
  @Input() venta: boolean = true;
  @Input() compra: boolean = false;

  @Output() emitirArrItems: EventEmitter<any> = new EventEmitter();
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @ViewChild('inputItem', { read: ElementRef })
  inputItem: ElementRef<HTMLInputElement>;
  @ViewChild(NgbDropdown) dropdown: NgbDropdown;
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;

  private readonly _generalService = inject(GeneralService);

  constructor() {
    super();
  }

  ngAfterViewInit() {
    if (this.inputItem?.nativeElement.value === '') {
      this.inputItem?.nativeElement.focus();
    }
  }

  agregarItem(item: any) {
    this.itemSeleccionado = item;
    if (this.campoInvalido) {
      this.campoInvalido = false;
      this.changeDetectorRef.detectChanges();
    }
    this.emitirArrItems.emit(item);
  }

  consultarItems(event: any) {
    this._generalService
      .consultaApi<ItemSeleccionar[]>(
        'general/cuenta_banco/seleccionar/',
        { nombre__icontains: event?.target.value })
      .subscribe((respuesta) => {
        this.arrItemsLista = respuesta;
        this.changeDetectorRef.detectChanges();
      });
  }

  aplicarFiltrosItems(event: any) {
    this._generalService
      .consultaApi<ItemSeleccionar[]>(
        'general/cuenta_banco/seleccionar/',
        { nombre__icontains: event?.target.value })
      .pipe(
        tap((respuesta) => {
          this.arrItemsLista = respuesta;
          this.inputItem.nativeElement.focus();
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();
  }

  onDropdownClose() {
    if (this.itemSeleccionado === null) {
      this.emitirLineaVacia.emit();
    }
  }
}
