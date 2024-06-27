import { Ciudad } from '@interfaces/general/ciudad';
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
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { Regimen } from '@interfaces/general/regimen';
import { TipoIdentificacion } from '@interfaces/general/tipoIdentificacion';
import { TipoPersona } from '@interfaces/general/tipoPersona';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { EmpresaService } from '@modulos/empresa/servicios/empresa.service';
import { empresaActualizacionAction } from '@redux/actions/empresa.actions';
import { asyncScheduler, tap, throttleTime, zip } from 'rxjs';
import {
  NgbDropdown,
  NgbDropdownAnchor,
  NgbDropdownMenu,
  NgbDropdownItem,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {
  NgClass,
  NgTemplateOutlet,
  NgFor,
  NgIf,
  LowerCasePipe,
  TitleCasePipe,
  CommonModule,
} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CardComponent } from '@comun/componentes/card/card.component';
import { obtenerEmpresaId } from '@redux/selectors/empresa.selectors';
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
    CardComponent,
    NgClass,
    NgTemplateOutlet,
    NgFor,
    NgbDropdown,
    NgbDropdownAnchor,
    NgbDropdownMenu,
    NgbDropdownItem,
    NgxMaskDirective,
    CommonModule,
    LowerCasePipe,
    TitleCasePipe,
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
  @Input() empresa_id!: string;
  @Output() emitirActualizacion: EventEmitter<any> = new EventEmitter();
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  @ViewChild('inputBusquedaResolucion', { static: true })
  inputBusquedaResolucion!: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private contenedorService: ContenedorService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService,
    private modalService: NgbModal
  ) {
    super();
  }

  ngOnInit() {
    this.store
      .select(obtenerEmpresaId)
      .subscribe((id) => (this.empresa_id = id));
    this.consultarInformacion();
  }

  consultarInformacion() {
    this.empresaService
      .consultarDetalle(this.empresa_id)
      .subscribe((respuesta: any) => {
        this.changeDetectorRef.detectChanges();
      });
  }

  abrirModalNuevoItem(content: any) {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.changeDetectorRef.detectChanges();
  }

  cerrarModal() {
    this.consultarInformacion();
    this.modalService.dismissAll();
  }
}
