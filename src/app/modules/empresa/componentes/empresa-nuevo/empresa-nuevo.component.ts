import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaService } from '../../servicios/empresa.service';
import { DevuelveDigitoVerificacionService } from '@comun/services/devuelve-digito-verificacion.service';
import { Router } from '@angular/router';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { Store } from '@ngrx/store';
import { of, switchMap, tap } from 'rxjs';
import { AlertaService } from '@comun/services/alerta.service';

@Component({
  selector: 'app-empresa-nuevo',
  templateUrl: './empresa-nuevo.component.html',
  styleUrls: ['./empresa-nuevo.component.scss'],
})
export class EmpresaNuevoComponent implements OnInit {
  formularioEmpresaNuevo: FormGroup;
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = '';
  visualizarBtnAtras = true;
  procesando = false;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private devuelveDigitoVerificacionService: DevuelveDigitoVerificacionService,
    private renderer2: Renderer2,
    private router: Router,
    private store: Store,
    private alertaService: AlertaService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.store.select(obtenerId).subscribe((codigoUsuario) => {
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

  // convenience getter for easy access to form fields
  get formFields() {
    return this.formularioEmpresaNuevo.controls;
  }

  enviarFormulario(dataFormularioLogin: any) {
    this.visualizarBtnAtras = false;
    this.procesando = true;

    this.empresaService
      .consultarNombre(dataFormularioLogin.subdominio)
      .pipe(
        switchMap(({validar}) => {
          if (!validar) {
            this.procesando = false;
            this.changeDetectorRef.detectChanges();
           //this.formFields.subdominio.setErrors({ EmpresaYaExiste: true });
            this.alertaService.mensajeError('Error', 'Nombre en uso');
          } else {
             return this.empresaService.nuevo(dataFormularioLogin, this.codigoUsuario);
          }
          return of(null);
        })
      )
      .subscribe((respuesta: any)=>{
        if(respuesta.empresa){
          this.alertaService.mensajaExitoso('Nueva empresa creada', '');
          this.router.navigate(['/empresa/lista']);
          this.procesando = false;
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
