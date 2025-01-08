import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { General } from '@comun/clases/general';
import { ContenedorService } from '@modulos/contenedor/servicios/contenedor.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { obtenerContenedorImagen } from '@redux/selectors/contenedor.selectors';
import { EMPTY, of, switchMap, take, tap } from 'rxjs';
import { ExtrasModule } from 'src/app/_metronic/partials';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { ContenedorEditarComponent } from '../contenedor-editar/contenedor-editar.component';

@Component({
  selector: 'app-contenedor-detalle',
  templateUrl: './contenedor-detalle.component.html',
  styleUrls: ['./contenedor-detalle.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    ExtrasModule,
    SharedModule,
    ContenedorEditarComponent,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    CommonModule,
  ],
})
export class ContenedorDetalleComponent extends General implements OnInit {
  contenedor_id =
    this.activatedRoute.snapshot.paramMap.get('contenedorCodigo')!;
  imagen$ = this.store.select(obtenerContenedorImagen);

  informacionEmpresa: any;

  constructor(private contenedorService: ContenedorService) {
    super();
  }

  ngOnInit() {
    this.consultarDetalle();
  }

  consultarDetalle() {
    this.informacionEmpresa = {
      contenedor_id: 0,
      id: 0,
      imagen: '',
      nombre: '',
      subdominio: '',
      usuario_id: 0,
      rol: '',
      usuarios: 0,
      plan_id: 0,
      plan_nombre: 0,
      usuarios_base: 0,
      ciudad: 0,
      correo: '',
      direccion: '',
      identificacion: 0,
      nombre_corto: '',
      numero_identificacion: 0,
      telefono: '',
    };

    this.contenedorService
      .consultarInformacion(this.contenedor_id)
      .pipe(
        tap((respuesta: any) => {
          this.informacionEmpresa = respuesta;
          this.changeDetectorRef.detectChanges();
        }),
        switchMap((respuesta: any) =>
          this.imagen$.pipe(
            take(1), // Obtén el valor actual de `imagen$` una vez
            switchMap((imagenActual) => {
              // Compara el contenido actual con `respuesta.imagen`
              if (imagenActual !== respuesta.imagen) {
                // Si son diferentes, emite `respuesta.imagen`
                this.imagen$ = of(respuesta.imagen);
                this.changeDetectorRef.detectChanges();
                return of(EMPTY);
              } else {
                // Si son iguales, continúa con el flujo actual
                if (!respuesta.imagen.includes('logo_defecto')) {
                  this.imagen$ = of(this._getImageUrl(respuesta.imagen));
                }
                this.changeDetectorRef.detectChanges();
                return of(EMPTY);
              }
            })
          )
        )
      )
      .subscribe();

    this.changeDetectorRef.detectChanges();
  }

  private _getImageUrl(baseImageUrl: string): string {
    return `${baseImageUrl}?t=${new Date().getTime()}`;
  }
}
