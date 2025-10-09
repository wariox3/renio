import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { AnimationFadeInUpDirective } from '@comun/directive/animation-fade-in-up.directive';
import {
  ContenedorInvitacionLista,
  Contenedor,
} from '@interfaces/usuario/contenedor';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';

import { TranslateModule } from '@ngx-translate/core';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { tap } from 'rxjs';

@Component({
  selector: 'app-contenedor-invitacion',
  templateUrl: './contenedor-invitacion.component.html',
  styleUrl: './contenedor-invitacion.component.scss',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    CardComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    AnimationFadeInUpDirective,
  ],
})
export class ContenedorInvitacionComponent extends General implements OnInit {
  public invitaciones = signal<ContenedorInvitacionLista[]>([]);
  public formularioEmpresaInvitacion: FormGroup;
  public usuarioCodigo = 0;
  public contenedorId: number = 0;
  public contenedor = signal<Contenedor | undefined>(undefined);

  constructor(
    private formBuilder: FormBuilder,
    private contenedorService: ContenedorService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.activatedRoute.parent?.params.subscribe(params => {
      this.contenedorId = +params['contenedorId'];
      this.constultarDetallesContenedor();
      this.consultarListaInvitaciones();
    });
  }

  constultarDetallesContenedor() {
    this.contenedorService.detalle(this.contenedorId).subscribe((respuesta) => {
      this.contenedor.set(respuesta);
    });
  }

  consultarListaInvitaciones() {
    this.contenedorService
      .listaInvitaciones(this.contenedorId)
      .subscribe((respuesta) => {
        this.invitaciones.set(respuesta.results);
      });
  }

  get formFields() {
    return this.formularioEmpresaInvitacion.controls;
  }

  initForm() {
    this.formularioEmpresaInvitacion = this.formBuilder.group({
      nombre: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ]),
      ],
    });
  }

  formSubmit() {
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.usuarioCodigo = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });

    if (this.formularioEmpresaInvitacion.valid) {
      this.contenedorService
        .enviarInvitacion({
          aplicacion: 'reddoc',
          contenedor_id: this.contenedorId,
          invitado: this.formFields.nombre.value,
          usuario_id: this.usuarioCodigo,
        })
        .subscribe(() => {
          this.alertaService.mensajaExitoso(
            `Se ha enviado un correo de invitación.`,
          );
          this.consultarListaInvitaciones();
          this.formularioEmpresaInvitacion.reset();
        });
    } else {
      this.formularioEmpresaInvitacion.markAllAsTouched();
    }
  }

  eliminarInvitado(usuario_id: Number) {
    this.alertaService
      .mensajeValidacion(
        'Eliminar usuario de esta contenedor',
        'Este proceso no tiene reversa',
        'warning',
      )
      .then(({ isConfirmed }) => {
        if (isConfirmed) {
          this.contenedorService
            .eliminarEmpresaUsuario(usuario_id)
            .pipe(
              tap(() => {
                this.alertaService.mensajaExitoso(
                  this.translateService.instant(
                    'FORMULARIOS.MENSAJES.COMUNES.PROCESANDOELIMINACION',
                  ),
                );
                this.consultarListaInvitaciones();
              }),
            )
            .subscribe();
        }
      });
  }

  contenedorAlcanzoMaxUsuarios() {
    const contenedorData = this.contenedor();
    if (!contenedorData) return false;
    
    const usuariosBase = contenedorData.plan_usuarios_base || contenedorData.usuarios_base || 0;
    const isAvailable = contenedorData.usuarios >= usuariosBase;

    if (isAvailable) {
      this.formularioEmpresaInvitacion.get('nombre')?.disable();
    } else {
      this.formularioEmpresaInvitacion.get('nombre')?.enable();
    }

    return isAvailable;
  }
}
