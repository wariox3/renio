import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaService } from '@comun/services/alerta.service';
import { ResumenService } from '@modulos/profile/services/resumen.service';
import { Store } from '@ngrx/store';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { obtenerImagen } from '@redux/selectors/usuario-imagen.selectors';
import { switchMap } from 'rxjs';
import { arrPaises } from './listaPaises';
import { usuarioActionActualizarNombreCorto } from '@redux/actions/usuario.actions';
import { obtenerUsuarioCorreo } from '@redux/selectors/usuario-correo.selectors';
import { EmpresaService } from '../../../empresa/servicios/empresa.service';
import { Empresa } from '@interfaces/usuario/empresa';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  arrEmpresas: Empresa[] = [];
  usuarioInformacion = {
    id: '',
    nombreCorto: '',
    nombre: '',
    apellido: '',
    telefono: '',
    indicativoPais: '',
  };
  arrPaises = arrPaises;
  srcResult: string = '';
  habilitarEdicionFormulario: boolean = false;
  formularioResumen: FormGroup;
  usuarioImagen$ = this.store.select(obtenerImagen);
  usuarioCorreo = this.store.select(obtenerUsuarioCorreo)
  @ViewChild('btnGuardar', { read: ElementRef })
  btnGuardar!: ElementRef<HTMLButtonElement>;
  codigoUsuario = '';
  constructor(
    private store: Store,
    private resumenService: ResumenService,
    private formBuilder: FormBuilder,
    private renderer2: Renderer2,
    private alertaService: AlertaService,
    private changeDetectorRef: ChangeDetectorRef,
    private empresaService: EmpresaService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.consultarLista();
    this.store.select(obtenerId).subscribe((codigoUsuario) => {
      this.codigoUsuario = codigoUsuario;
      this.changeDetectorRef.detectChanges();
    });
    this.consultarInformacion();
  }

  initForm() {
    this.formularioResumen = this.formBuilder.group({
      nombre: [
        this.usuarioInformacion.nombre,
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      apellido: [
        this.usuarioInformacion.apellido,
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
      indicativoPais: [this.usuarioInformacion.indicativoPais],
      telefono: [
        this.usuarioInformacion.telefono,
        Validators.compose([Validators.minLength(3), Validators.maxLength(40)]),
      ],
      nombreCorto: [
        this.usuarioInformacion.nombreCorto,
        Validators.compose([
          Validators.required,
          Validators.maxLength(100)
        ])
      ]
    });
  }

  get formFields() {
    return this.formularioResumen.controls;
  }

  visualizarFormulario() {
    this.habilitarEdicionFormulario = !this.habilitarEdicionFormulario;
    this.initForm();
  }

  consultarInformacion() {
    this.resumenService.perfil(this.codigoUsuario).subscribe({
      next: (respuesta: any) => {
        let indicativo = '';
        let telefono = '';
        if (respuesta.telefono) {
          indicativo = respuesta.telefono.split(' ')[0];
          telefono = respuesta.telefono.split(' ')[1];
        }
        this.usuarioInformacion = {
          id: respuesta.id,
          nombre: respuesta.nombre,
          apellido: respuesta.apellido,
          telefono: telefono,
          nombreCorto: respuesta.nombre_corto,
          indicativoPais: indicativo,
        };
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  archivoSeleccionado(event: any) {
    const inputNode: any = event.target;

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
      };

      reader.readAsDataURL(inputNode.files[0]);
    }
  }

  formSubmit() {
    if (this.formularioResumen.valid) {
      this.renderer2.setAttribute(
        this.btnGuardar.nativeElement,
        'disabled',
        'true'
      );
      this.renderer2.setProperty(
        this.btnGuardar.nativeElement,
        'innerHTML',
        'Procesando'
      );
      this.resumenService
        .actualizarInformacion({
          id: this.usuarioInformacion.id,
          nombre: this.formularioResumen.value.nombre,
          apellido: this.formularioResumen.value.apellido,
          telefono: `${this.formularioResumen.value.indicativoPais} ${this.formularioResumen.value.telefono}`,
          nombreCorto: this.formularioResumen.value.nombreCorto,
        })
        .subscribe({
          next: (respuesta) => {
            this.store.dispatch(
              usuarioActionActualizarNombreCorto({
                nombre_corto: this.formularioResumen.value.nombreCorto,
              })
            );
            this.alertaService.mensajaExitoso('Actualización exitosa', '');
            this.consultarInformacion();
            this.habilitarEdicionFormulario = !this.habilitarEdicionFormulario;
          },
        });

      this.renderer2.removeAttribute(this.btnGuardar.nativeElement, 'disabled');
      this.renderer2.setProperty(
        this.btnGuardar.nativeElement,
        'innerHTML',
        'GUARDAR'
      );
    } else {
      this.formularioResumen.markAllAsTouched();
    }
  }

  consultarLista() {
    this.store
      .select(obtenerId)
      .pipe(switchMap((usuarioId) => this.empresaService.lista(usuarioId)))
      .subscribe({
        next: (respuesta) => {
          this.arrEmpresas = respuesta.empresas;
          this.changeDetectorRef.detectChanges();
        },
        error: ({ error }): void => {
          this.alertaService.mensajeError(
            'Error consulta',
            `Código: ${error.codigo} <br/> Mensaje: ${error.mensaje}`
          );
        },
      });
  }
}
