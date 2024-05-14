import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
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
import { KeysPipe } from '@pipe/keys.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { ImportarComponent } from '../importar/importar.component';
import { General } from '@comun/clases/general';
import { interval, take } from 'rxjs';
import { AnimationFadeinUpDirective } from '@comun/Directive/AnimationFadeinUp.directive';
import {
  obtenerMenuDataMapeo,
  obtenerMenuDataMapeoBuscarCampo,
  obtenerMenuDataMapeoCamposVisibleTabla,
} from '@redux/selectors/menu.selectors';
import { ActualizarCampoMapeo } from '@redux/actions/menu.actions';

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
    AnimationFadeinUpDirective,
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
  columnas: any[];
  columnasVibles: any[] = [];
  datosFiltrados: any[] = [];
  claveLocalStore: string;
  tipo: string;
  btnGrupoResponsive = false;
  @Input() encabezado: any;
  @Input() modelo: string;
  @Input() datos: any[] = [];
  @Input() cantidad_registros!: number;
  @Input() confirmacionRegistrosEliminado: boolean;
  @Output() emitirExportarExcel: EventEmitter<any> = new EventEmitter();
  @Output() cantidadRegistros: EventEmitter<any> = new EventEmitter();
  @Output() emitirDesplazamiento: EventEmitter<any> = new EventEmitter();
  @Output() emitirOrdenamiento: EventEmitter<any> = new EventEmitter();
  @Output() emitirPaginacion: EventEmitter<any> = new EventEmitter();
  @Output() emitirRegistraEliminar: EventEmitter<Number[]> = new EventEmitter();
  @Output() emitirNavegarNuevo: EventEmitter<any> = new EventEmitter();
  @Output() emitirNavegarDetalle: EventEmitter<number> = new EventEmitter();
  @Output() emitirNavegarEditar: EventEmitter<number> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((parametro) => {
      this.claveLocalStore = `itemNombre_tabla`;
      this.tipo = localStorage.getItem('itemTipo')!;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.encabezado) {
      if (!localStorage.getItem(this.claveLocalStore)) {
        localStorage.setItem(
          this.claveLocalStore,
          JSON.stringify(changes.encabezado.currentValue)
        );
      }
    }
    if (changes.confirmacionRegistrosEliminado) {
      this.confirmacionRegistrosEliminado =
        changes.confirmacionRegistrosEliminado.currentValue;
    }
    this.construirTabla();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    // Verifica el ancho de la pantalla y actualiza el estado de btnGrupoResponsive
    this.btnGrupoResponsive = window.innerWidth < 481;
  }

  construirTabla() {
    this.cargandoTabla = true;
    // se reinicia la tabla
    this.datosFiltrados = [];
    //se cargan los datos que se visualizan en la thead
    this.store.select(obtenerMenuDataMapeo).subscribe((campos: any) => {
      this.columnas = campos;
    });
    this.store
      .select(obtenerMenuDataMapeoCamposVisibleTabla)
      .subscribe((campos: any) => {
        this.columnasVibles = campos;
      });
    //se  construye el tbody de la tabla
    // Recorre todas las claves en el objeto "camposVisibles"
    for (let clave in this.columnasVibles) {
      // Obtiene el nombre de la clave actual y lo convierte a minúsculas
      let buscarClave = this.columnasVibles[clave].nombre.toLowerCase();
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
            this.datosFiltrados[key][buscarClave] = {
              valor: this.datos[key][buscarClave],
              campoTipo: this.columnasVibles[clave].campoTipo,
              aplicaFormatoNumerico: this.columnasVibles[clave]
                .aplicaFormatoNumerico
                ? true
                : false,
            };
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
    this.emitirNavegarNuevo.emit();
  }

  navegarEditar(id: number) {
    this.emitirNavegarEditar.emit(id);
  }

  navegarDetalle(id: number) {
    this.emitirNavegarDetalle.emit(id);
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
    this.arrRegistrosEliminar = [];
    // Si todos los registros están seleccionados, deselecciona todos
    if (this.selectAll) {
      this.toggleSelectAll();
    }
  }

  // Esta función alterna la selección de todos los registros y actualiza el array de registros a eliminar en consecuencia.
  toggleSelectAll() {
    // Itera sobre todos los datos
    this.datosFiltrados.forEach((item: any) => {
      // Establece el estado de selección de cada registro
      item.selected = !item.selected;
      // Busca el índice del registro en el array de registros a eliminar
      const index = this.arrRegistrosEliminar.indexOf(item.id);
      // Si el registro ya estaba en el array de registros a eliminar, lo elimina
      if (index !== -1) {
        this.arrRegistrosEliminar.splice(index, 1);
      } else {
        // Si el registro no estaba en el array de registros a eliminar, lo agrega
        this.arrRegistrosEliminar.push(item.id.valor);
      }
    });
    // Alterna el estado de selección de todos los registros
    this.selectAll = !this.selectAll;
    this.changeDetectorRef.detectChanges();
  }

  // Función para determinar el tipo de dato y aplicar formato si es necesario
  getTipoDato(valor: any, campo: any) {
    // Verifica si se proporciona un campo
    if (campo) {
      // Switch para manejar diferentes tipos de campo
      switch (campo.campoTipo) {
        // Si el campo es FloatField o IntegerField
        case 'FloatField':
        case 'IntegerField':
          // Verifica si se debe aplicar formato numérico
          if (campo.aplicaFormatoNumerico) {
            // Formatea el valor con dos decimales y comas para separar miles
            let formattedValue = valor
              .toFixed()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

            return `${formattedValue}`;
          }
          // Si no se aplica formato numérico, devuelve el valor sin modificar
          return valor;
        // Si el campo es de tipo booleano
        case 'Booleano':
          // Convierte el valor booleano a 'Si' si es verdadero y a 'No' si es falso
          return valor ? 'Si' : 'No';
        // En caso de que el tipo de campo no sea ninguno de los anteriores
        default:
          // Devuelve el valor sin modificar
          return valor;
      }
    }
  }

  // Esta función establece que todas las columnas  sean visibles, y luego reconstruye la tabla.
  visualizarColumnas() {
    let nuevasColumnasVisibles = JSON.parse(JSON.stringify(this.columnas));
    nuevasColumnasVisibles.map((campo: any) => {
      campo.visibleTabla = true;
    });
    this.store.dispatch(
      ActualizarCampoMapeo({ dataMapeo: nuevasColumnasVisibles })
    );

    // Reconstruye la tabla
    this.construirTabla();
  }

  // Esta función agrega o quita una columna específica de la tabla según su visibilidad actual y luego reconstruye la tabla.
  agregarColumna(columna: string) {
    // Busca la columna en "encabezado" y modifica su propiedad "visibleTabla" para alternar su visibilidad
    let nuevasColumnasVisibles = JSON.parse(JSON.stringify(this.columnas));
    nuevasColumnasVisibles.find((campo: any) => {
      if (campo.nombre === columna) {
        campo.visibleTabla = !campo.visibleTabla;
      }
    });
    this.store.dispatch(
      ActualizarCampoMapeo({ dataMapeo: nuevasColumnasVisibles })
    );
    // Reconstruye la tabla
    this.construirTabla();
  }

  // Esta función filtra las columnas en base al texto ingresado y actualiza la lista de columnas visibles.
  filterCampos(event: any) {
    // Obtiene el texto de búsqueda en minúsculas
    const buacarCompo = event.target.value.toLowerCase();
    // Filtra las columnas en "columnasVibles" basándose en el texto de búsqueda
    if (buacarCompo !== '') {
      this.store
        .select(obtenerMenuDataMapeoBuscarCampo(buacarCompo))
        .subscribe((resultado) => (this.columnas = resultado));
    } else {
      this.store.select(obtenerMenuDataMapeo).subscribe((campos: any) => {
        this.columnas = campos;
      });
    }
  }

  exportarExcel() {
    this.emitirExportarExcel.emit(true);
  }

  visualizarBtnEstado(item: any) {
    // Verificar si item tiene la propiedad estado_aprobado
    if (item.hasOwnProperty('estado_aprobado')) {
      return !item['estado_aprobado'].valor;
    } else {
      return true;
    }
  }
}
