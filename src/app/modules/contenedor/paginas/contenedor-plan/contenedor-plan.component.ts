import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { General } from '@comun/clases/general';
import { Plan } from '@modulos/contenedor/interfaces/plan.interface';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { TranslateModule } from '@ngx-translate/core';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-contenedor-plan',
  templateUrl: './contenedor-plan.component.html',
  styleUrl: './contenedor-plan.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class ContenedorPlanComponent extends General implements OnInit {
  formularioContenedor: FormGroup;
  contenedor_id!: number;
  arrPlanes: Plan[] = [];
  informacionPlan: any = '';
  planSeleccionado: number = 2;

  public informacionPlanes = this.contenedorService.informacionPlan;
  public planesAgrupadosPorTipo = signal<Plan[]>([]);
  public activePlanTab = signal<'F' | 'E'>('F');
  public disablePlanes = signal<boolean>(false);

  constructor(
    private formBuilder: FormBuilder,
    private contenedorService: ContenedorService,
    protected activatedRoute: ActivatedRoute,
  ) {
    super();
    this.initForm();
  }

  ngOnInit() {
    // Obtener el ID del contenedor desde los parámetros de la ruta padre
    this.activatedRoute.parent?.params.subscribe(params => {
      this.contenedor_id = +params['contenedorId'];
      this.consultarInformacion();
    });
  }

  initForm() {
    this.formularioContenedor = this.formBuilder.group({
      plan_id: [
        this.planSeleccionado,
        Validators.compose([Validators.required]),
      ],
    });
  }

  consultarInformacion() {
    this.contenedorService
      .consultarInformacion(this.contenedor_id)
      .pipe(
        tap((respuesta: any) => {
          this.planSeleccionado = respuesta.plan_id;
          this.formularioContenedor.patchValue({
            plan_id: respuesta.plan_id,
          });

          let posicion: keyof typeof this.contenedorService.informacionPlan =
            respuesta.plan_id;
          this.informacionPlan =
            this.contenedorService.informacionPlan[posicion];

          if (respuesta.plan_id >= 9) {
            this.disablePlanes.set(true);
          }
        }),
        switchMap(() => {
          return this.contenedorService.listaPlanes();
        }),
        tap((respuestaPlanes) => {
          this.arrPlanes = respuestaPlanes.results;
          this.cambiarTipoPlanes('F');
          this.seleccionarTabDependiendoPlan();
          this.changeDetectorRef.detectChanges();
        }),
      )
      .subscribe();
  }

  public seleccionarTabDependiendoPlan() {
    const contieneId = this.planesAgrupadosPorTipo().some(
      (plan) => plan.id === this.planSeleccionado,
    );

    if (contieneId) {
      this.cambiarTipoPlanes('F');
    } else {
      this.cambiarTipoPlanes('E');
    }
  }

  public cambiarTipoPlanes(planTipo: 'F' | 'E') {
    this.activePlanTab.set(planTipo);
    this.planesAgrupadosPorTipo.update(() => {
      return this.arrPlanes.filter((plan) => plan.plan_tipo_id === planTipo);
    });
  }

  seleccionarPlan(plan: Plan) {
    this.planSeleccionado = plan.id;
    this.formularioContenedor.get('plan_id')?.setValue(plan.id);
    this.changeDetectorRef.detectChanges();
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
              this.contenedor_id,
            );
          }),
          tap((respuestaActualizacion: any) => {
            if (respuestaActualizacion.actualizacion) {
              this.alertaService.mensajaExitoso(
                this.translateService.instant(
                  'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOACTUALIZACION',
                ),
              );
              this.consultarInformacion();
            }
          }),
        )
        .subscribe();
    } else {
      this.formularioContenedor.markAllAsTouched();
    }
  }
}
