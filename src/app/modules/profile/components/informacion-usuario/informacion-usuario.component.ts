import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResumenService } from '@modulos/profile/services/resumen.service';
import { arrPaises } from '../overview/listaPaises';
import {
  usuarioActionActualizarIdioma,
  usuarioActionActualizarInformacionUsuario,
} from '@redux/actions/usuario.actions';
import { General } from '@comun/clases/general';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  obtenerUsuarioImagen,
  obtenerUsuarioNombre,
  obtenerUsuarioId
} from '@redux/selectors/usuario.selectors';

@Component({
  selector: 'app-informacion-usuario',
  templateUrl: './informacion-usuario.component.html',
  styleUrls: ['./informacion-usuario.component.scss'],
})
export class InformacionUsuarioComponent extends General implements OnInit {
  usuarioInformacion = {
    id: '',
    nombreCorto: '',
    nombre: '',
    apellido: '',
    telefono: '',
    indicativoPais: '',
    idioma: '',
  };
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  arrPaises = arrPaises;
  formularioResumen: FormGroup;
  srcResult: string = '';
  usuarioImagen$ = this.store.select(obtenerUsuarioImagen);
  usuarioCorreo = this.store.select(obtenerUsuarioNombre);
  codigoUsuario = '';
  btnGuardar!: ElementRef<HTMLButtonElement>;
  modalRef: any;
  language: LanguageFlag;
  langs = languages;

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
        this.usuarioInformacion.nombreCorto,
        Validators.compose([Validators.required, Validators.maxLength(255)]),
      ],
      idioma: [
        this.usuarioInformacion.idioma,
        Validators.compose([Validators.minLength(2)]),
      ],
      imagen: null,
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

      this.resumenService
        .actualizarInformacion({
          id: this.usuarioInformacion.id,
          nombre: this.formularioResumen.value.nombre || null,
          apellido: this.formularioResumen.value.apellido || null,
          telefono: telefono,
          nombreCorto: this.formularioResumen.value.nombreCorto,
          idioma: this.formularioResumen.value.idioma,
          imagen: this.formularioResumen.value.imagen
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
    } else {
      this.formularioResumen.markAllAsTouched();
    }
  }

  consultarInformacion() {
    this.resumenService.perfil(this.codigoUsuario).subscribe({
      next: (respuesta: any) => {
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
          nombreCorto: respuesta.nombre_corto,
          indicativoPais: indicativo,
          idioma: respuesta.idioma,
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

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

const languages = [
  {
    lang: 'es',
    name: 'Español',
    flag: '🇪🇸',
  },
  {
    lang: 'en',
    name: 'English',
    flag: '🇺🇸',
  },
];
