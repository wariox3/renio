import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { obtenerUsuarioCorreo } from '@redux/selectors/usuario-correo.selectors';
import { ResumenService } from '@modulos/profile/services/resumen.service';
import { obtenerId } from '@redux/selectors/usuario-id.selectors';
import { arrPaises } from '../overview/listaPaises';
import {
  usuarioActionActualizarIdioma,
  usuarioActionActualizarInformacionUsuario,
} from '@redux/actions/usuario.actions';
import { General } from '@comun/clases/general';
import { obtenerImagen } from '@redux/selectors/usuario-imagen.selectors';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { obtenerUsuarioidioma } from '@redux/selectors/usuario-idioma.selectors';
import { tap } from 'rxjs';

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
  usuarioImagen$ = this.store.select(obtenerImagen);
  usuarioCorreo = this.store.select(obtenerUsuarioCorreo);
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
    this.store.select(obtenerId).subscribe((codigoUsuario) => {
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

  archivoSeleccionado(event: any) {
    const inputNode: any = event.target;

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.srcResult = e.target.result;
        this.formularioResumen.patchValue({
          imagen: e.target.result,
        });
        this.changeDetectorRef.detectChanges();
      };

      reader.readAsDataURL(inputNode.files[0]);
    }
  }

  formSubmit() {
    if (this.formularioResumen.valid) {
      let validacionTelefono =
        this.formularioResumen.value.telefono === null
          ? `${this.formularioResumen.value.indicativoPais}`
          : `${this.formularioResumen.value.indicativoPais} ${this.formularioResumen.value.telefono}`;
      this.resumenService
        .actualizarInformacion({
          id: this.usuarioInformacion.id,
          nombre:
            this.formularioResumen.value.nombre === ''
              ? null
              : this.formularioResumen.value.nombre,
          apellido:
            this.formularioResumen.value.apellido === ''
              ? null
              : this.formularioResumen.value.apellido,
          telefono: validacionTelefono,
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
                telefono: validacionTelefono,
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

  removerArchivoSeleccionado() {
    this.srcResult = '/metronic8/demo1/assets/media/svg/avatars/blank.svg';
    this.formularioResumen.patchValue({
      imagen: null,
    });
    this.changeDetectorRef.detectChanges();
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
    name: 'Ingles',
    flag: '🇺🇸',
  },
];
