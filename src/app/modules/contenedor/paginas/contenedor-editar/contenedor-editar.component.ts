import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { CargarImagenComponent } from '@comun/componentes/cargar-imagen/cargar-imagen.component';
import { Empresa } from '@interfaces/contenedor/empresa.interface';
import { Plan } from '@modulos/contenedor/interfaces/plan.interface';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ContenedorActionActualizarImagen } from '@redux/actions/contenedor.actions';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-contenedor-editar',
  templateUrl: './contenedor-editar.component.html',
  styleUrl: './contenedor-editar.component.scss',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CargarImagenComponent,
  ],
})
export class ContenedorEditarComponent extends General implements OnInit {
  formularioContenedor: FormGroup;
  informacionContenedor = {
    nombre: '',
    plan_id: 0,
  };
  arrPlanes: Plan[] = [];
  informacionPlan: any = '';
  planSeleccionado: number = 2;

  public informacionPlanes = this.contenedorService.informacionPlan;
  public planesAgrupadosPorTipo = signal<Plan[]>([]);
  public activePlanTab = signal<'F' | 'E'>('F');

  @Input() contenedor_id!: number;
  @Output() emitirActualizacion: EventEmitter<any> = new EventEmitter();
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;

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
    ciudad_id: 0,
    identificacion_id: 0,
    regimen_id: 0,
    regimen_nombre: '',
    tipo_persona_id: 0,
    tipo_persona_nombre: '',
    suscriptor: 0,
    rededoc_id: '',
    asistente_electronico: false,
    asistente_predeterminado: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private contenedorService: ContenedorService
  ) {
    super();
    this.initForm();
  }

  ngOnInit() {
    this.consultarInformacion();
  }

  consultarInformacion() {
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
            plan_id: respuesta.plan_id,
          });

          this.planSeleccionado = respuesta.plan_id;
          let posicion: keyof typeof this.contenedorService.informacionPlan =
            respuesta.plan_id;
          this.informacionPlan =
            this.contenedorService.informacionPlan[posicion];
        }),
        switchMap(() => {
          return this.contenedorService.listaPlanes();
        }),
        tap((respuestaPlanes) => {
          this.arrPlanes = respuestaPlanes;
          this.cambiarTipoPlanes('F');
          this.seleccionarTabDependiendoPlan();
          this.changeDetectorRef.detectChanges();
        })
      )
      .subscribe();

    this.changeDetectorRef.detectChanges();
  }

  public seleccionarTabDependiendoPlan() {
    const contieneId = this.planesAgrupadosPorTipo().some(
      (plan) => plan.id === this.planSeleccionado
    );

    if (contieneId) {
      this.cambiarTipoPlanes('F');
    } else {
      this.cambiarTipoPlanes('E');
    }
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

  seleccionarPlan(plan: Plan) {
    this.planSeleccionado = plan.id;
    this.formularioContenedor.get('plan_id')?.setValue(plan.id);
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
            (this.informacionEmpresa.imagen =
              'https://semantica.sfo3.digitaloceanspaces.com/itrio/test/empresa/logo_defecto.jpg'),
              this.store.dispatch(
                ContenedorActionActualizarImagen({
                  imagen:
                    'https://semantica.sfo3.digitaloceanspaces.com/itrio/test/empresa/logo_defecto.jpg',
                })
              );
            this.changeDetectorRef.detectChanges();
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

  public cambiarTipoPlanes(planTipo: 'F' | 'E') {
    this.activePlanTab.set(planTipo);
    this.planesAgrupadosPorTipo.update(() => {
      return this.arrPlanes.filter((plan) => plan.plan_tipo_id === planTipo);
    });
  }
}
