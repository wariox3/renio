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
  formularioEmpresaNuevo: FormGroup;
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = '';
  visualizarBtnAtras = true;
  procesando = false;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
    this.store.select(obtenerUsuarioId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
  }

  initForm() {
    this.formularioEmpresaNuevo = this.formBuilder.group({
      nombre: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100), // Se ha removido la restricción de mayúsculas
        ]),
      ],
      subdominio: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern(/^[a-z-0-9]*$/), // Se ha removido la restricción de mayúsculas
        ]),
      ],
    });
  }

  get formFields() {
    return this.formularioEmpresaNuevo.controls;
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

  limpiarFormulario() {
    this.formularioEmpresaNuevo.reset();
  }

  obtenerDigitoVerificacion() {
    if (this.formFields.nit.value) {
      let dv = this.devuelveDigitoVerificacionService.digitoVerificacion(
        parseInt(this.formFields.nit.value)
      );
      if (dv) {
        this.formFields.digitoVerificacion.setValue(`${dv}`);
      }
    }
  }

  cambiarTextoAMinusculas() {
    this.formFields.subdominio.setValue(
      this.formFields.subdominio.value.toLowerCase()
    );
  }

  confirmarExistencia() {
    if (this.formFields.subdominio.value !== '') {
      this.empresaService
        .consultarNombre(this.formFields.subdominio.value)
        .subscribe(({ validar }) => {
          if (!validar) {
            this.formFields.subdominio.setErrors({ EmpresaYaExiste: true });
            this.changeDetectorRef.detectChanges();
          }
        });
    }
  }
}
