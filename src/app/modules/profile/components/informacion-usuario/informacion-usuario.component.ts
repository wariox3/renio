import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { General } from '@comun/clases/general';
import { ResumenService } from '@modulos/profile/services/resumen.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  usuarioActionActualizarIdioma,
  usuarioActionActualizarInformacionUsuario,
} from '@redux/actions/usuario.actions';
import {
  obtenerUsuarioId,
  obtenerUsuarioImagen,
  obtenerUsuarioUserName,
} from '@redux/selectors/usuario.selectors';
import { arrPaises } from '../overview/listaPaises';
import { LanguageFlag } from '@interfaces/comunes/language-flag/language-flag.interface';
import { UsuarioInformacionPerfil } from '@modulos/profile/interfaces/usuario-Informacion-perfil';

@Component({
  selector: 'app-informacion-usuario',
  templateUrl: './informacion-usuario.component.html',
  styleUrls: ['./informacion-usuario.component.scss'],
  standalone: true,
  imports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgTemplateOutlet,
    NgFor,
    NgIf,
  ],
})
export class InformacionUsuarioComponent extends General implements OnInit {
  usuarioInformacion: UsuarioInformacionPerfil = {
    id: 0,
    nombre_corto: '',
    nombre: '',
    apellido: '',
    telefono: '',
    indicativoPais: '',
    idioma: '',
    numero_identificacion: '',
    cargo: '',
  };
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  arrPaises = arrPaises;
  formularioResumen: FormGroup;
  srcResult: string = '';
  usuarioImagen$ = this.store.select(obtenerUsuarioImagen);
  usuarioCorreo = this.store.select(obtenerUsuarioUserName);
  codigoUsuario = 0;
  btnGuardar!: ElementRef<HTMLButtonElement>;
  modalRef: any;
  language: LanguageFlag;
  langs = [
    {
      lang: 'es',
      name: 'Español',
    },
    {
      lang: 'en',
      name: 'English',
    },
  ];

  constructor(
    private resumenService: ResumenService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
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
    this.formularioResumen = this.formBuilder.group({
      nombre: [
        this.usuarioInformacion.nombre,
        Validators.compose([Validators.maxLength(255)]),
      ],
      apellido: [
        this.usuarioInformacion.apellido,
        Validators.compose([Validators.maxLength(255)]),
      ],
      indicativoPais: [this.usuarioInformacion.indicativoPais],
      telefono: [
        this.usuarioInformacion.telefono,
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern(/^[0-9]+$/),
        ]),
      ],
      nombreCorto: [
        this.usuarioInformacion.nombre_corto,
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
      idioma: [
        this.usuarioInformacion.idioma,
        Validators.compose([Validators.minLength(2)]),
      ],
      cargo: [
        this.usuarioInformacion.cargo,
        Validators.compose([Validators.maxLength(255)]),
      ],
      numero_identificacion: [
        this.usuarioInformacion.numero_identificacion,
        Validators.compose([Validators.maxLength(20)]),
      ],
      imagen: null,
    });

    this.formularioResumen.get('cargo')?.valueChanges.subscribe((value) => {
      if (value === '') {
        this.formularioResumen.get('cargo')?.setValue(null);
      }
    });

    this.formularioResumen
      .get('numero_identificacion')
      ?.valueChanges.subscribe((value) => {
        if (value === '') {
          this.formularioResumen.get('numero_identificacion')?.setValue(null);
        }
      });
  }

  get formFields() {
    return this.formularioResumen.controls;
  }

  formSubmit() {
    if (this.formularioResumen.valid) {
      let indicativoPais = this.formularioResumen.value.indicativoPais;
      let telefono = this.formularioResumen.value.telefono;

      if (indicativoPais && telefono) {
        telefono = `${indicativoPais} ${telefono}`;
      } else if (telefono) {
        telefono = telefono;
      } else if (indicativoPais) {
        telefono = indicativoPais;
      } else {
        telefono = null;
      }

      if (this.usuarioInformacion.id) {
        this.resumenService
          .actualizarInformacion({
            id: this.usuarioInformacion.id,
            nombre: this.formularioResumen.value.nombre || null,
            apellido: this.formularioResumen.value.apellido || null,
            telefono: telefono,
            nombreCorto: this.formularioResumen.value.nombreCorto,
            idioma: this.formularioResumen.value.idioma,
            imagen: this.formularioResumen.value.imagen,
            cargo: this.formularioResumen.value.cargo,
            numero_identificacion:
              this.formularioResumen.value.numero_identificacion,
          })
          .subscribe({
            next: (respuesta) => {
              this.store.dispatch(
                usuarioActionActualizarInformacionUsuario({
                  nombre_corto: this.formularioResumen.value.nombreCorto,
                  nombre: this.formularioResumen.value.nombre,
                  apellido: this.formularioResumen.value.apellido,
                  telefono: telefono,
                  idioma: this.formularioResumen.value.idioma,
                  cargo: this.formularioResumen.value.cargo,
                  numero_identificacion:
                    this.formularioResumen.value.numero_identificacion,
                })
              );
              this.store.dispatch(
                usuarioActionActualizarIdioma({
                  idioma: this.formularioResumen.value.idioma,
                })
              );
              this.translateService.use(this.formularioResumen.value.idioma);
              this.changeDetectorRef.detectChanges();
              this.alertaService.mensajaExitoso(
                this.translateService.instant(
                  'FORMULARIOS.MENSAJES.COMUNES.ACTUALIZACION'
                )
              );
            },
          });
        this.modalService.dismissAll();
      }
    } else {
      this.formularioResumen.markAllAsTouched();
    }
  }

  consultarInformacion() {
    this.resumenService.perfil(this.codigoUsuario).subscribe({
      next: (respuesta) => {
        let indicativo = '';
        let telefono = '';

        if (respuesta.telefono) {
          if (respuesta.telefono.charAt(0) === '+') {
            let partesTelefono = respuesta.telefono.split(' ');
            indicativo = partesTelefono[0];
            telefono = partesTelefono[1];
          } else {
            telefono = respuesta.telefono;
          }
        }
        this.usuarioInformacion = {
          id: respuesta.id,
          nombre: respuesta.nombre,
          apellido: respuesta.apellido,
          telefono: telefono,
          nombre_corto: respuesta.nombre_corto,
          indicativoPais: indicativo,
          idioma: respuesta.idioma,
          cargo: respuesta.cargo,
          numero_identificacion: respuesta.numero_identificacion,
        };
        this.changeDetectorRef.detectChanges();
        this.initForm();
      },
    });
  }

  open() {
    this.consultarInformacion();
    this.changeDetectorRef.detectChanges();
    this.modalRef = this.modalService.open(this.customTemplate, {
      backdrop: 'static',
      size: 'lg',
    });
  }
}
