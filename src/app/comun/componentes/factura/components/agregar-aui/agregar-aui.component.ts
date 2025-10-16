import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SeleccionarProductoComponent } from '../seleccionar-producto/seleccionar-producto.component';
import { FacturaService } from '../../services/factura.service';

// Interfaz para la estructura de datos AIU
export interface ItemAIU {
  item_id: number;
  precio: number;
}

@Component({
  selector: 'app-agregar-aui',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    SeleccionarProductoComponent,
  ],
  templateUrl: './agregar-aui.component.html',
  styleUrl: './agregar-aui.component.scss',
})
export class AgregarAuiComponent implements OnInit {
  @Input() detalleId?: number;
  @Output() auiConfiguracionEvent = new EventEmitter<ItemAIU[]>();

  private _facturaService = inject(FacturaService);

  // Signal para el estado de carga
  public cargando = signal(false);

  public formularioAIU = new FormGroup({
    gen_item_administracion: new FormControl(0, [Validators.required]),
    gen_item_imprevisto: new FormControl(0, [Validators.required]),
    gen_item_utilidad: new FormControl(0, [Validators.required]),
    gen_item_administracion_nombre: new FormControl('', [Validators.required]),
    gen_item_imprevisto_nombre: new FormControl('', [Validators.required]),
    gen_item_utilidad_nombre: new FormControl('', [Validators.required]),
    gen_item_administracion_valor: new FormControl(0),
    gen_item_imprevisto_valor: new FormControl(0),
    gen_item_utilidad_valor: new FormControl(0),
    item: new FormControl(0),
    item_nombre: new FormControl(''),
    item_valor: new FormControl(0),
  });

  constructor() {}

  ngOnInit(): void {
    this.consultarAIU();
    this.configurarEscuchaValorItem();
  }

  onGuardarConfiguracion() {
    // Activar el loader
    this.cargando.set(true);
    
    const valoresFormulario = this.formularioAIU.value;
    
    // Transformar los datos al formato requerido
    const datosAIU: ItemAIU[] = [
      {
        item_id: valoresFormulario.item || 0,
        precio: valoresFormulario.item_valor || 0
      },
      {
        item_id: valoresFormulario.gen_item_administracion || 0,
        precio: valoresFormulario.gen_item_administracion_valor || 0
      },
      {
        item_id: valoresFormulario.gen_item_imprevisto || 0,
        precio: valoresFormulario.gen_item_imprevisto_valor || 0
      },
      {
        item_id: valoresFormulario.gen_item_utilidad || 0,
        precio: valoresFormulario.gen_item_utilidad_valor || 0
      }
    ];

    // Emitir los datos transformados
    this.auiConfiguracionEvent.emit(datosAIU);
  }

  consultarAIU() {
    this._facturaService.consultarAIU().subscribe((respuesta) => {
      const configuracion = respuesta.configuracion[0];

      if (configuracion) {
        this.formularioAIU.patchValue({
          gen_item_administracion: configuracion.gen_item_administracion,
          gen_item_imprevisto: configuracion.gen_item_imprevisto,
          gen_item_utilidad: configuracion.gen_item_utilidad,
          gen_item_administracion_nombre:
            configuracion.gen_item_administracion__nombre,
          gen_item_imprevisto_nombre: configuracion.gen_item_imprevisto__nombre,
          gen_item_utilidad_nombre: configuracion.gen_item_utilidad__nombre,
        });
      }
    });
  }

  seleccionarItem(item: any) {
    this.formularioAIU.patchValue({
      item: item.id,
      item_nombre: item.nombre,
    });
  }

  configurarEscuchaValorItem() {
    // Escuchar cambios en el campo item_valor
    this.formularioAIU.get('item_valor')?.valueChanges.subscribe((valor) => {
      if (valor !== null && valor !== undefined) {
        // Redondear el valor a 2 decimales
        const valorRedondeado = this.redondearA2Decimales(valor);
        
        // Solo actualizar si el valor cambió para evitar bucles infinitos
        if (valorRedondeado !== valor) {
          this.formularioAIU.get('item_valor')?.setValue(valorRedondeado, { emitEvent: false });
        }
        
        this.calcularValoresAIU(valorRedondeado);
      } else {
        this.calcularValoresAIU(0);
      }
    });
  }

  calcularValoresAIU(valorBase: number) {
    // Calcular porcentajes AIU
    const valorAdministracion = this.calcularPorcentaje(valorBase, 9); // 9%
    const valorImprevisto = this.calcularPorcentaje(valorBase, 3);     // 3%
    const valorUtilidad = this.calcularPorcentaje(valorBase, 5);       // 5%

    // Actualizar los campos calculados
    this.formularioAIU.patchValue({
      gen_item_administracion_valor: valorAdministracion,
      gen_item_imprevisto_valor: valorImprevisto,
      gen_item_utilidad_valor: valorUtilidad,
    });
  }

  seleccionarItemAdministracion(item: any) {
    this.formularioAIU.patchValue({
      gen_item_administracion: item.id,
      gen_item_administracion_nombre: item.nombre,
    });
  }

  seleccionarItemImprevisto(item: any) {
    this.formularioAIU.patchValue({
      gen_item_imprevisto: item.id,
      gen_item_imprevisto_nombre: item.nombre,
    });
  }

  seleccionarItemUtilidad(item: any) {
    this.formularioAIU.patchValue({
      gen_item_utilidad: item.id,
      gen_item_utilidad_nombre: item.nombre,
    });
  }

  limpiarItemUtilidad() {
    this.formularioAIU.patchValue({
      gen_item_utilidad: 0,
      gen_item_utilidad_nombre: '',
    });
  }

  limpiarItemAdministracion() {
    this.formularioAIU.patchValue({
      gen_item_administracion: 0,
      gen_item_administracion_nombre: '',
    });
  }

  limpiarItemImprevisto() {
    this.formularioAIU.patchValue({
      gen_item_imprevisto: 0,
      gen_item_imprevisto_nombre: '',
    });
  }

  limpiarItem() {
    this.formularioAIU.patchValue({
      item: 0,
      item_nombre: '',
    });
  }

  private calcularPorcentaje(valor: number, porcentaje: number): number {
    const resultado = (valor * porcentaje) / 100;
    // Redondear a 2 decimales
    return Math.round(resultado * 100) / 100;
  }

  private redondearA2Decimales(valor: number): number {
    return Math.round(valor * 100) / 100;
  }

  public finalizarCarga() {
    this.cargando.set(false);
  }
}
