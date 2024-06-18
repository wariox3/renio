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
import { CardComponent } from '@comun/componentes/card/card.component';
import { Plan } from '@interfaces/contenedor/plan';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';

import { NgbActiveModal, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-contenedor-editar',
  templateUrl: './contenedor-editar.component.html',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    CardComponent,
    NgbModalModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
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
}
