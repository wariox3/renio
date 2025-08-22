import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertaService } from '@comun/services/alerta.service';
import { ContenedorConfiguracionUsuario } from '@interfaces/usuario/contenedor';
import { AuthService } from '@modulos/auth';
import { TransporteService } from '@modulos/transporte/servicios/transporte.service';

@Component({
  selector: 'app-empresa-usuario-editar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './empresa-usuario-editar.component.html',
  styleUrl: './empresa-usuario-editar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpresaUsuarioEditarComponent implements OnInit {
  @Input() usuario: ContenedorConfiguracionUsuario | null = null;

  @Output() usuarioActualizado = new EventEmitter<void>();

  private _transporteService = inject(TransporteService);
  private _authService = inject(AuthService);
  private _alertaService = inject(AlertaService);

  public operaciones = signal<any[]>([]);

  ngOnInit(): void {
    this.consultarOperaciones();
  }

  consultarOperaciones() {
    this._transporteService.operaciones().subscribe((respuesta) => {
      this.operaciones.set(respuesta);
    });
  }

  onSelectChange(event: Event, campo: string) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    const valor = value === 'null' ? null : value;
    this._authService
      .actualizarUsuario(this.usuario?.usuario!, { [campo]: valor })
      .subscribe((respuesta) => {
        this._alertaService.mensajaExitoso('Usuario actualizado');
        this.usuarioActualizado.emit();
      });
  }
}
