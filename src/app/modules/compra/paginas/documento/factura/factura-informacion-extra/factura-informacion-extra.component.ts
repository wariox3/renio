import { CommonModule, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormularioFacturaService } from '@comun/services/factura/formulario-factura.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-factura-informacion-extra',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule, FormsModule],
  templateUrl: './factura-informacion-extra.component.html',
  styleUrl: './factura-informacion-extra.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaInformacionExtraComponent implements OnInit {
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
}
