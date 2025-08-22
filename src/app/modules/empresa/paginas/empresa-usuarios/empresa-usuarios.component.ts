import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { General } from '@comun/clases/general';
import { CardComponent } from '@comun/componentes/card/card.component';
import { ContenedorConfiguracionUsuario } from '@interfaces/usuario/contenedor';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { EmpresaUsuarioEditarComponent } from "@modulos/empresa/componentes/empresa-usuarios/empresa-usuario-editar/empresa-usuario-editar.component";
import { NgbModal, NgbModalRef, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { configuracionVisualizarBreadCrumbsAction } from '@redux/actions/configuracion.actions';
import { selectContenedorId } from '@redux/selectors/contenedor.selectors';

interface Usuario {
  id: number;
  nombre: string;
  username: string;
}

@Component({
  selector: 'app-empresa-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    TranslateModule,
    NgbNavModule,
    EmpresaUsuarioEditarComponent
],
  templateUrl: './empresa-usuarios.component.html',
  styleUrl: './empresa-usuarios.component.scss',
})
export default class EmpresaUsuariosComponent
  extends General
  implements OnInit, OnDestroy
{
  private _contenedorService = inject(ContenedorService);

  // Datos de ejemplo para la lista de usuarios
  public operaciones = signal<any[]>([]);
  public usuarioSeleccionado = signal<ContenedorConfiguracionUsuario | null>(null);
  public contenedorId: number = 0;
  public usuarios = signal<ContenedorConfiguracionUsuario[]>([]);

  // Variables para el modal
  modalRef: NgbModalRef | null = null;

  constructor(private modalService: NgbModal) {
    super();
  }

  ngOnInit() {
    this.cargarContenedorId();
    this.consultarUsuariosContenedor();
    this.store.dispatch(
      configuracionVisualizarBreadCrumbsAction({
        configuracion: {
          visualizarBreadCrumbs: false,
        },
      }),
    );
  }

  cargarContenedorId() {
    this.store.select(selectContenedorId).subscribe((contenedorId) => {
      this.contenedorId = contenedorId;
    });
  }

  consultarUsuariosContenedor() {
    this._contenedorService.listaUsuarios(this.contenedorId).subscribe((respuesta) => {
      this.usuarios.set(respuesta.results);
    });
  }

  onUsuarioActualizado() {
    this.consultarUsuariosContenedor();
  }


  /**
   * Navega a la edición de un usuario
   * @param usuario Usuario a editar
   * @param content Contenido del modal
   */
  navegarEditar(usuario: ContenedorConfiguracionUsuario, content: any): void {
    this.usuarioSeleccionado.set(usuario);
    this.modalRef = this.modalService.open(content, { size: 'lg' });
  }

  /**
   * Cierra el modal
   * @param event Evento de cierre
   */
  cerrarModal(event: any): void {
    this.usuarioSeleccionado.set(null);
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  ngOnDestroy(): void {
    this.alertaService.cerrarMensajes();
    this.store.dispatch(
      configuracionVisualizarBreadCrumbsAction({
        configuracion: {
          visualizarBreadCrumbs: true,
        },
      }),
    );
  }
}
