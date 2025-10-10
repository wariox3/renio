import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { General } from '@comun/clases/general';
import { ContenedorLista } from '@interfaces/usuario/contenedor';
import { TranslateModule } from '@ngx-translate/core';
import { ContenedorInvitacionComponent } from '../contenedor-invitacion/contenedor-invitacion.component';

@Component({
  selector: 'app-contenedor-invitacion-lista',
  templateUrl: './contenedor-invitacion-lista.component.html',
  styleUrl: './contenedor-invitacion-lista.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    ContenedorInvitacionComponent,
  ],
})
export class ContenedorInvitacionListaComponent extends General implements OnInit {
  contenedor_id!: number;
  contenedor: ContenedorLista = {
    id: 0,
    rol: '',
    contenedor: '',
    contenedor_id: 0,
    contenedor__nombre: '',
    contenedor__usuarios: 0,
    contenedor__imagen: '',
    contenedor__schema_name: '',
    contenedor__reddoc: false,
    contenedor__ruteo: false,
    contenedor__cortesia: false,
    contenedor__plan_id: 0,
    contenedor__plan__nombre: '',
    contenedor__plan__usuarios_base: 0,
    usuario_id: 0,
    seleccion: false,
    acceso_restringido: false,
    contenedores: [],
  };

  constructor(
    protected activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    // Obtener el ID del contenedor desde los parámetros de la ruta padre
    this.activatedRoute.parent?.params.subscribe(params => {
      this.contenedor_id = +params['contenedorId'];
      // Simular datos del contenedor para el componente de invitación
      this.contenedor.contenedor_id = this.contenedor_id;
    });
  }

}
