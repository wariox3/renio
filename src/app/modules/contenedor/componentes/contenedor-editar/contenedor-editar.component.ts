import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { CargarImagenComponent } from '@comun/componentes/cargar-imagen/cargar-imagen.component';
import { Empresa } from '@interfaces/contenedor/empresa';
import { Plan } from '@interfaces/contenedor/plan';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContenedorActionActualizarImagen } from '@redux/actions/contenedor.actions';
import { usuarioActionActualizarImagen } from '@redux/actions/usuario.actions';
import { obtenerEmpresaInformacion } from '@redux/selectors/empresa.selectors';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-contenedor-editar',
  templateUrl: './contenedor-editar.component.html',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CargarImagenComponent
]
})
export class ContenedorEditarComponent extends General implements OnInit {
  formularioContenedor: FormGroup;
  informacionContenedor = {
    nombre: '',
    plan_id: 0,
  };
  arrPlanes: Plan[] = [];
  informacionPlan: any = '';
  planSeleccionado: Number = 2;
  @Input() contenedor_id!: string;
  @Output() emitirActualizacion: EventEmitter<any> = new EventEmitter();
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;
  informacionEmpresa: Empresa = {
    id: 0,
    numero_identificacion: '',
    digito_verificacion: '',
    identificacion_nombre: '',
    nombre_corto: '',
    direccion: '',
    telefono: '',
    correo: '',
    imagen: '',
    ciudad: 0,
    identificacion: 0,
    regimen: 0,
    regimen_nombre: '',
    tipo_persona: 0,
    tipo_persona_nombre: '',
    suscriptor: 0,
    ciudad_id: 0,
    identificacion_id: 0,
    rededoc_id: '',
    asistente_electronico: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private contenedorService: ContenedorService
  ) {
    super();
  }
  ngOnInit() {
    this.initForm();
  }

  openModal() {

    this.contenedorService
      .consultarInformacion(this.contenedor_id)
      .subscribe((respuesta: any) => {
        this.informacionEmpresa = respuesta;
        this.changeDetectorRef.detectChanges();
      });

    this.contenedorService
      .consultarInformacion(this.contenedor_id)
      .pipe(
        tap((respuesta: any) => {
          this.informacionContenedor = respuesta;

          this.formularioContenedor.patchValue({
            nombre: respuesta.nombre,
            plan_id: respuesta.plan_id
          })

          this.planSeleccionado = respuesta.plan_id
          let posicion: keyof typeof this.contenedorService.informacionPlan = respuesta.plan_id;
          this.informacionPlan = this.contenedorService.informacionPlan[posicion]

          this.modalRef = this.modalService.open(this.customTemplate, {
            backdrop: 'static',
            size: 'lg',
            keyboard: false,
          });
        }),
        switchMap(() => {
          return this.contenedorService.listaPlanes();
        }),
        tap((respuestaPlanes) => {
          this.arrPlanes = respuestaPlanes;
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();

      this.changeDetectorRef.detectChanges();
  }

  initForm() {
    this.formularioContenedor = this.formBuilder.group({
      nombre: [
        this.informacionContenedor.nombre,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100), // Se ha removido la restricción de mayúsculas
        ]),
      ],
      plan_id: [
        this.planSeleccionado,
        Validators.compose([Validators.required]),
      ],
    });
  }

  formSubmit() {
    if (this.formularioContenedor.valid) {
      this.store
      .select(obtenerUsuarioId)
      .pipe(
        switchMap((codigoUsuario) => {
          return this.contenedorService.editar(
            this.formularioContenedor.value,
            codigoUsuario,
            this.contenedor_id
          );
        }),
        tap((respuestaActualizacion: any) => {
          if (respuestaActualizacion.actualizacion) {
            this.modalService.dismissAll();
            this.alertaService.mensajaExitoso(
              this.translateService.instant(
                'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION'
              )
            );
            return this.emitirActualizacion.emit(true);
          }
        })
      )
      .subscribe();
    } else {
      this.formularioContenedor.markAllAsTouched();
    }

  }

  seleccionarPlan(plan_id: any) {
    this.planSeleccionado = plan_id;
    let posicion: keyof typeof this.contenedorService.informacionPlan = plan_id;
    this.informacionPlan = this.contenedorService.informacionPlan[posicion]
    this.changeDetectorRef.detectChanges();
  }

  recuperarBase64(event: any) {
    this.contenedorService
      .cargarLogo(this.contenedor_id, event)
      .subscribe((respuesta) => {
        if (respuesta.cargar) {
          this.alertaService.mensajaExitoso(
            this.translateService.instant(
              'FORMULARIOS.MENSAJES.COMUNES.CARGARIMAGEN'
            )
          );

          return this.emitirActualizacion.emit(true);

        }
      });
  }

  eliminarLogo(event: boolean) {
    this.contenedorService
      .eliminarLogoEmpresa(this.contenedor_id)
      .pipe(
        switchMap((respuestaEliminarLogoEmpresa) => {
          if (respuestaEliminarLogoEmpresa.limpiar) {
            this.informacionEmpresa.imagen = respuestaEliminarLogoEmpresa.imagen
            this.store.dispatch(ContenedorActionActualizarImagen({imagen: respuestaEliminarLogoEmpresa.imagen}))
            this.changeDetectorRef.detectChanges()
            this.emitirActualizacion.emit(true);
          }
          return of(null);
        })
      )
      .subscribe();
  }

    getImageUrl(baseImageUrl: string): string {
    return `${baseImageUrl}?t=${new Date().getTime()}`;
  }
}
