import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Listafiltros } from '@interfaces/comunes/filtros';
import { KeysPipe } from '@pipe/keys.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { ImportarComponent } from '../importar/importar.component';
import { General } from '@comun/clases/general';
import { interval, take } from 'rxjs';

@Component({
  selector: 'app-comun-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
  standalone: true,
  providers: [CurrencyPipe, DecimalPipe],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    KeysPipe,
    TranslateModule,
    TranslationModule,
    ImportarComponent,
  ],
})
export class TablaComponent extends General implements OnInit, OnChanges {
  protected changeDetectorRef = inject(ChangeDetectorRef);

  tamanoEncabezado = 0;
  arrCantidadRegistro = [50, 100, 200];
  registrosVisiables = 50;
  lado: number = 0;
  al: number = this.registrosVisiables;
  ordenadoTabla: string = '';
  cargandoDatos = false;
  arrRegistrosEliminar: number[] = [];
  selectAll = false;
  cargandoTabla = false;
  encabezadoTestCopia: any;
  camposVisibles: any;
  datosFiltrados: any = [];
  claveLocalStore: string;
  @Input() encabezado: Listafiltros[] = [];
  @Input() encabezadoTest: any;
  @Input() modelo: string;
  @Input() datos: any[] = [];
  @Input() cantidad_registros!: number;

  @Output() cantidadRegistros: EventEmitter<any> = new EventEmitter();
  @Output() emitirDesplazamiento: EventEmitter<any> = new EventEmitter();
  @Output() emitirOrdenamiento: EventEmitter<any> = new EventEmitter();
  @Output() emitirPaginacion: EventEmitter<any> = new EventEmitter();
  @Output() emitirRegistraEliminar: EventEmitter<Number[]> = new EventEmitter();

  constructor(private currencyPipe: CurrencyPipe) {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.claveLocalStore = `${parametro.modulo}_${parametro.modelo}_${parametro.tipo}_tabla`;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.encabezadoTest) {
      if (!localStorage.getItem(this.claveLocalStore)) {
        localStorage.setItem(
          this.claveLocalStore,
          JSON.stringify(changes.encabezadoTest.currentValue)
        );
      }
    }
    this.construirTabla();
  }

  construirTabla() {
    this.cargandoTabla = true;
    // se reinicia la tabla
    this.datosFiltrados = [];
    //se usa para listar las columnas
    this.encabezadoTestCopia = JSON.parse(
      localStorage.getItem(this.claveLocalStore)!
    );

    //se crean los datos que se visualizan en la thead de la tabla
    this.camposVisibles = this.encabezadoTestCopia.filter(
      (titulo: any) => titulo.visibleTabla === true
    );

    //se  construye el tbody de la tabla

    // Recorre todas las claves en el objeto "camposVisibles"
    for (let clave in this.camposVisibles) {
      // Obtiene el nombre de la clave actual y lo convierte a minúsculas
      let buscarClave = this.camposVisibles[clave].nombre.toLowerCase();

      // Recorre todas las claves en el objeto "datos"
      for (const key in this.datos) {
        // Verifica si la clave pertenece al objeto "datos"
        if (Object.prototype.hasOwnProperty.call(this.datos, key)) {
          // Verifica si el objeto "datos" en la clave actual tiene la propiedad buscada
          if (this.datos[key].hasOwnProperty(buscarClave)) {
            // Si la clave actual no existe en el objeto "datosFiltrados", la crea
            if (!this.datosFiltrados.hasOwnProperty(key)) {
              this.datosFiltrados[key] = {};
            }
            // Agrega la propiedad y el valor correspondientes al objeto "datosFiltrados"
            this.datosFiltrados[key][buscarClave] =
              this.datos[key][buscarClave];
          }
        }
      }
    }

    interval(800)
      .pipe(take(1))
      .subscribe(() => {
        this.cargandoTabla = false;
        this.changeDetectorRef.detectChanges();
      });

    // Detecta los cambios y actualiza la vista
    this.changeDetectorRef.detectChanges();
  }

  navegarNuevo() {
    this.router.navigate(['/nuevo'], {
      queryParams: {
        modulo: this.modulo,
        modelo: this.modelo,
        tipo: this.tipo,
      },
    });
  }

  navegarEditar(id: number) {
    this.router.navigate(['/editar'], {
      queryParams: {
        modulo: this.modulo,
        modelo: this.modelo,
        tipo: this.tipo,
        detalle: id,
      },
    });
  }

  navegarDetalle(id: number) {
    this.router.navigate(['/detalle'], {
      queryParams: {
        modulo: this.modulo,
        modelo: this.modelo,
        tipo: this.tipo,
        detalle: id,
      },
    });
  }

  cambiarCantidadRegistros() {
    this.al = this.registrosVisiables;
    this.cantidadRegistros.emit(this.registrosVisiables);
  }

  aumentarDesplazamiento() {
    this.lado = this.lado + this.registrosVisiables;
    this.al = this.al + this.registrosVisiables;
    this.emitirDesplazamiento.emit(this.lado);
  }

  disminuirDesplazamiento() {
    if (this.lado > 0) {
      let nuevoValor = this.lado - this.registrosVisiables;
      this.al = this.al - this.registrosVisiables;

      this.lado = nuevoValor <= 1 ? 0 : nuevoValor;
      this.emitirDesplazamiento.emit(this.lado);
    }
  }

  validarCantidadMostrando() {
    if (this.lado < 0) {
      this.lado = 1;
    }
    this.emitirDesplazamiento.emit(this.lado);
  }

  validarCantidadAl() {
    if (this.al > this.cantidad_registros) {
      this.al = this.cantidad_registros;
    } else if (this.al <= 0) {
      this.al = this.registrosVisiables;
    }

    this.cantidadRegistros.emit(this.al);
  }

  orderPor(nombre: string, i: number) {
    if (this.ordenadoTabla.charAt(0) == '-') {
      this.ordenadoTabla = nombre.toLowerCase();
    } else {
      this.ordenadoTabla = `-${nombre.toLowerCase()}`;
    }

    this.emitirOrdenamiento.emit(this.ordenadoTabla);
  }

  calcularValorMostrar(evento: any) {
    if (evento.target.value) {
      let valorInicial = evento.target.value;
      if (valorInicial.includes('-')) {
        let [limite, desplazamiento] = valorInicial.split('-');
        desplazamiento = desplazamiento - limite + 1;
        if (limite > 0) {
          limite -= 1;
          if (desplazamiento > 0 && limite > 0) {
            this.emitirPaginacion.emit({ desplazamiento, limite });
          }
        }
        if (desplazamiento < 0) {
          evento.target.value = `${this.lado}-${this.al}`;
        }
      } else {
        this.emitirPaginacion.emit({
          desplazamiento: parseInt(valorInicial),
          limite: 1,
        });
      }
    } else {
      evento.target.value = `${this.lado}-${this.al}`;
      this.emitirPaginacion.emit({
        desplazamiento: this.al,
        limite: this.lado,
      });
    }
  }

  // Esta función agrega o elimina un registro del array de registros a eliminar según su presencia actual en el array.
  agregarRegistrosEliminar(id: number) {
    // Busca el índice del registro en el array de registros a eliminar
    const index = this.arrRegistrosEliminar.indexOf(id);
    // Si el registro ya está en el array, lo elimina
    if (index !== -1) {
      this.arrRegistrosEliminar.splice(index, 1);
    } else {
      // Si el registro no está en el array, lo agrega
      this.arrRegistrosEliminar.push(id);
    }
  }

  // Esta función emite un evento con los registros que se van a eliminar, luego limpia el array de registros a eliminar y deselecciona todos los registros si "selectAll" es verdadero.
  eliminarRegistros() {
    // Emite un evento con los registros a eliminar
    this.emitirRegistraEliminar.emit(this.arrRegistrosEliminar);
    // Limpia el array de registros a eliminar
    this.arrRegistrosEliminar = [];
    // Si todos los registros están seleccionados, deselecciona todos
    if (this.selectAll) {
      this.toggleSelectAll();
    }
  }

  // Esta función alterna la selección de todos los registros y actualiza el array de registros a eliminar en consecuencia.
  toggleSelectAll() {
    // Alterna el estado de selección de todos los registros
    this.selectAll = !this.selectAll;

    // Itera sobre todos los datos
    this.datosFiltrados.forEach((item: any) => {
      // Establece el estado de selección de cada registro
      item.selected = this.selectAll;
      // Busca el índice del registro en el array de registros a eliminar
      const index = this.arrRegistrosEliminar.indexOf(item.id);
      // Si el registro ya estaba en el array de registros a eliminar, lo elimina
      if (index !== -1) {
        this.arrRegistrosEliminar.splice(index, 1);
      } else {
        // Si el registro no estaba en el array de registros a eliminar, lo agrega
        this.arrRegistrosEliminar.push(item.id);
      }
    });
  }

  getTipoDato(valor: any, key: string) {
    let tipo = typeof valor;
    switch (tipo) {
      case 'number':
        const identificadores = [
          'id',
          'descuento',
          'impuesto',
          'contacto',
          'documento_tipo',
          'metodo_pago',
        ];
        if (!identificadores.includes(key)) {
          let formattedAmount = this.currencyPipe.transform(
            valor,
            'COP',
            'symbol',
            '1.0-0'
          );
          return formattedAmount;
        } else {
          return valor;
        }
      case 'boolean':
        return valor ? 'Si' : 'No';
      default:
        return valor;
    }
  }

  // Esta función establece que todas las columnas en la copia de "encabezadoTest" y "encabezadoTestCopia" sean visibles, y luego reconstruye la tabla.
  visualizarColumnas() {
    // Establece todas las columnas como visibles en la copia de "encabezadoTestCopia"
    this.encabezadoTestCopia.map((item: any) => (item.visibleTabla = true));
    // Establece todas las columnas como visibles en "encabezadoTest"
    this.encabezadoTest.map((campo: any) => (campo.visibleTabla = true));

    localStorage.setItem(
      this.claveLocalStore,
      JSON.stringify(this.encabezadoTest)
    );

    // Reconstruye la tabla
    this.construirTabla();
  }

  // Esta función agrega o quita una columna específica de la tabla según su visibilidad actual y luego reconstruye la tabla.
  agregarColumna(columna: string) {
    // Busca la columna en "encabezadoTest" y modifica su propiedad "visibleTabla" para alternar su visibilidad
    this.encabezadoTest.find((campo: any) => {
      if (campo.nombre === columna) {
        campo.visibleTabla = !campo.visibleTabla;
      }
    });

    localStorage.setItem(
      this.claveLocalStore,
      JSON.stringify(this.encabezadoTest)
    );

    // Reconstruye la tabla
    this.construirTabla();
  }

  // Esta función filtra las columnas en base al texto ingresado y actualiza la lista de columnas visibles.
  filterCampos(event: any) {
    // Obtiene el texto de búsqueda en minúsculas
    const searchText = event.target.value.toLowerCase();
    // Filtra las columnas en "encabezadoTestCopia" basándose en el texto de búsqueda
    if (searchText !== '') {
      this.encabezadoTestCopia = this.encabezadoTestCopia.filter((item: any) =>
        item.nombre.toLowerCase().includes(searchText)
      );
    } else {
      // Si el texto de búsqueda está vacío, muestra todas las columnas de nuevo
      this.encabezadoTestCopia = this.encabezadoTest;
    }
  }
}
