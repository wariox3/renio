import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit,
  Output,
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
import { ActivatedRoute } from '@angular/router';
import { DocumentoGuiaService } from '@modulos/venta/servicios/documento-guia.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-factura-modal-agregar-guia',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './factura-modal-agregar-guia.component.html',
})
export class FacturaModalAgregarGuiaComponent implements OnInit, OnDestroy {
  private readonly _modalService = inject(NgbModal);
  private _formBuilder = inject(FormBuilder);
  private destroy$ = new Subject<void>();
  private _documentoGuiaService = inject(DocumentoGuiaService);
  private _activatedRoute = inject(ActivatedRoute);

  public formularioAgregarGuia: FormGroup;
  @Output() registroExitoso = new EventEmitter<boolean>(false);
  @ViewChild('content') modal!: TemplateRef<any>;
  @ViewChild('inputGuia', { static: false }) inputGuia!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.inicializarFormulario();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  inicializarFormulario() {
    this.formularioAgregarGuia = this._formBuilder.group({
      guia_id: [null, [Validators.required, Validators.min(1)]],
    });
  }

  guardar() {
    if (!this.formularioAgregarGuia.valid) {
      this.formularioAgregarGuia.markAllAsTouched();
      return;
    }
    this._agregarGuia();
  }

  private _agregarGuia() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param) => {
          const documentoId = Number(param.id);
          return this._documentoGuiaService.adicionarGuia({
            documento_id: documentoId,
            ...this.formularioAgregarGuia.value,
          });
        })
      )
      .subscribe(() => {
        this.registroExitoso.emit(true);
        this.formularioAgregarGuia.reset();
      });
    this._enfocarYSeleccionarInputGuia();
  }

  openModal() {
    this.formularioAgregarGuia.reset();
    const modalRef = this._modalService.open(this.modal);

    modalRef.shown.subscribe(() => {
      this._enfocarYSeleccionarInputGuia();
    });
  }

  closeModal() {
    this._modalService.dismissAll();
  }

  private _enfocarYSeleccionarInputGuia() {
    setTimeout(() => {
      const inputElement = document.querySelector('input[formControlName="guia_id"]') as HTMLInputElement;

      // Early return si no existe el elemento
      if (!inputElement) {
        return;
      }

      // Enfocar y seleccionar
      inputElement.focus();
      inputElement.select();

      // Verificar después de un breve tiempo
      setTimeout(() => {
        const tieneFoco = document.activeElement === inputElement;
        if (!tieneFoco) {
          inputElement.focus();
          inputElement.select();
        }
      }, 50);
    }, 150);
  }
}
