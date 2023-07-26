import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from '../../servicios/empresa.service';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { obtenerUsuarioId } from '@redux/selectors/usuario.selectors';
import { of, switchMap, tap } from 'rxjs';
import { General } from '@comun/clases/general';
import { Empresa, EmpresaFormulario } from '@interfaces/usuario/empresa';

@Component({
  selector: 'app-empresa-nuevo',
  templateUrl: './empresa-nuevo.component.html',
  styleUrls: ['./empresa-nuevo.component.scss'],
})
export class EmpresaNuevoComponent extends General implements OnInit {
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = '';
  visualizarBtnAtras = true;
  procesando = false;

  informacionEmpresa: EmpresaFormulario = {
    nombre: '',
    subdominio: '',
    plan_id: 0,
    imagen: null,
  };

  constructor(
    private empresaService: EmpresaService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
  }


  enviarFormulario(dataFormularioLogin: EmpresaFormulario) {
    this.visualizarBtnAtras = false;
    this.procesando = true;

    this.empresaService
      .consultarNombre(dataFormularioLogin.subdominio)
      .pipe(
        switchMap(({validar}) => {
          if (!validar) {
            this.procesando = false;
            this.changeDetectorRef.detectChanges();
            this.alertaService.mensajeError('Error', 'Nombre en uso');
          } else {
             return this.empresaService.nuevo(dataFormularioLogin, this.codigoUsuario);
          }
          return of(null);
        })
      )
      .subscribe({
        next:(respuesta: any)=>{
            if(respuesta.empresa){
              this.alertaService.mensajaExitoso(
                this.translateService.instant("FORMULARIOS.MENSAJES.EMPRESAS.NUEVAEMPRESA")
              );
              this.router.navigate(['/empresa/lista']);
              this.procesando = false;
            }
        },
        error:() =>{
          this.procesando = false;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

}
