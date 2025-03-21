import { CommonModule, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import { TranslateModule } from '@ngx-translate/core';
import { SeleccionarResolucionComponent } from '../../../../../../comun/componentes/selectores/seleccionar-resolucion/seleccionar-resolucion.component';
import { RegistroAutocompletarGenResolucion } from '@interfaces/comunes/autocompletar/general/gen-resolucion.interface';

@Component({
  selector: 'app-documento-soporte-informacion-extra',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    FormsModule,
    SeleccionarResolucionComponent,
  ],
  templateUrl: './documento-soporte-informacion-extra.component.html',
  styleUrl: './documento-soporte-informacion-extra.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentoSoporteInformacionExtraComponent implements OnInit {
  public formularioService = inject(FormularioFacturaService);
  public formularioFactura = this.formularioService.form;

  modificarCampoFormulario(campo: string, otro: string | null) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.campoReactivoComentario();
  }

  campoReactivoComentario() {
    this.formularioFactura
      .get('comentario')
      ?.valueChanges.subscribe((value) => {
        if (value === '') {
          this.formularioFactura
            .get('comentario')
            ?.setValue(null, { emitEvent: false });
        }
      });
  }

  agregarResolucionSeleccionado(
    resolucion: RegistroAutocompletarGenResolucion | null,
  ) {
    if (resolucion) {
      this.formularioFactura.patchValue({
        resolucion: resolucion?.resolucion_id,
        resolucion_numero: resolucion?.resolucion_numero,
      });
    } else {
      this.formularioFactura.patchValue({
        resolucion: null,
        resolucion_numero: '',
      });
    }
  }
}
