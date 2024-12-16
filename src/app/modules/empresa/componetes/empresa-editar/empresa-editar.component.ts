import {
  CommonModule
} from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { Ciudad } from '@interfaces/general/ciudad';
import { Regimen } from '@interfaces/general/regimen';
import { TipoIdentificacion } from '@interfaces/general/tipoIdentificacion';
import { TipoPersona } from '@interfaces/general/tipoPersona';
import {
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { obtenerEmpresaId } from '@redux/selectors/empresa.selectors';
import { provideNgxMask } from 'ngx-mask';
import { EmpresaFormularioComponent } from '../empresa-formulario/empresa-fomrulario.component';

@Component({
  selector: 'app-empresa-editar',
  templateUrl: './empresa-editar.component.html',
  standalone: true,
  providers: [provideNgxMask()],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    EmpresaFormularioComponent,
  ],
})
export class EmpresaEditarComponent extends General implements OnInit {
  itemSeleccionado: any | null = null;
  formularioEmpresa: FormGroup;
  planSeleccionado: Number = 2;
  arrCiudades: Ciudad[] = [];
  arrIdentificacion: TipoIdentificacion[] = [];
  arrTipoPersona: TipoPersona[] = [];
  arrRegimen: Regimen[] = [];
  arrResoluciones: any[] = [];
  rededoc_id: null | number = null;
  @Output() emitirLineaVacia: EventEmitter<any> = new EventEmitter();
  @Input() empresaId!: string;
  @Output() emitirActualizacion: EventEmitter<any> = new EventEmitter();
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  @ViewChild('inputBusquedaResolucion', { static: true })
  inputBusquedaResolucion!: ElementRef<HTMLInputElement>;

  constructor(private modalService: NgbModal) {
    super();
  }

  ngOnInit() {
    this.store
      .select(obtenerEmpresaId)
      .subscribe((id) => (this.empresaId = id));
  }

  abrirModalNuevoItem(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  cerrarModal() {
    this.modalService.dismissAll();
  }
}
