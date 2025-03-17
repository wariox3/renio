import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContenedorService } from '../../servicios/contenedor.service';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { catchError, of, switchMap, tap, zip } from 'rxjs';
import { General } from '@comun/clases/general';
import { ContenedorFormulario } from '@interfaces/usuario/contenedor';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CardComponent } from '@comun/componentes/card/card.component';
import { ContenedorFormularioComponent } from '../contenedor-formulario/contenedor-formulario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { SecuencialLoaderComponent } from "../../../../comun/componentes/ui/secuencial-loader/secuencial-loader.component";

@Component({
  selector: 'app-contenedor-nuevo',
  templateUrl: './contenedor-nuevo.component.html',
  styleUrls: ['./contenedor-nuevo.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    CardComponent,
    ContenedorFormularioComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    SecuencialLoaderComponent
],
})
export class ContenedorNuevoComponent extends General implements OnInit {
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = 0;
  visualizarBtnAtras = true;
  procesando = false;

  informacionContenedor: ContenedorFormulario = {
    nombre: '',
    subdominio: '',
    plan_id: 0,
    imagen: null,
    ciudad: '',
    correo: '',
    direccion: '',
    identificacion: '',
    nombre_corto: '',
    numero_identificacion: '',
    telefono: '',
    ciudad_nombre: '',
    digito_verificacion: '',
  };

  constructor(private contenedorService: ContenedorService) {
    super();
  }

  ngOnInit() {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
    });
  }

  enviarFormulario(dataFormularioLogin: any) {
    this.visualizarBtnAtras = false;
    this.procesando = true;
    this.contenedorService
      .consultarNombre(dataFormularioLogin.subdominio)
      .pipe(
        switchMap(({ validar }) => {
          if (validar) {
            return this.contenedorService.nuevo(
              dataFormularioLogin,
              this.codigoUsuario
            );
          }
          return of(null);
        }),
        tap((respuestaNuevo: any) => {
          if (respuestaNuevo.contenedor) {
            this.alertaService.mensajaExitoso(
              this.translateService.instant(
                'FORMULARIOS.MENSAJES.CONTENEDOR.NUEVOCONTENEDOR'
              )
            );
            this.router.navigate(['/contenedor/lista']);
            this.procesando = false;
          }
        }),
        catchError(() => {
          this.procesando = false;
          this.changeDetectorRef.detectChanges();
          return of(null);
        })
      )
      .subscribe();
  }
}
