import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';


@Component({
  selector: 'app-base-filtro',
  templateUrl: './base-filtro.component.html',
  styleUrls: ['./base-filtro.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class BaseFiltroComponent {
  formularioItem: FormGroup;
  listaFiltros: any[] = []

  paises: string[] = ['País 1', 'País 2', 'País 3'];
  ciudadesPorPais: { [key: string]: string[] } = {
    'País 1': ['Ciudad 1-1', 'Ciudad 1-2', 'Ciudad 1-3'],
    'País 2': ['Ciudad 2-1', 'Ciudad 2-2', 'Ciudad 2-3'],
    'País 3': ['Ciudad 3-1', 'Ciudad 3-2', 'Ciudad 3-3']
  };
  ciudades: string[] = [];



  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  modalRef: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
  }

  initForm() {
    this.formularioItem = this.formBuilder.group({
      filtros: this.formBuilder.array([this.crearControlImpuesto()]), // Agregamos un control inicial
    });
  }

  get filtros() {
    return this.formularioItem.get('filtros') as FormArray;
  }

  private crearControlImpuesto(): FormGroup {
    return this.formBuilder.group({
      propiedad: [''],
      criterio: [''],
      busqueda: ['']
    });
  }

  agregarFiltro() {
    this.filtros.push(
      this.formBuilder.group({
        propiedad: [''],
        criterio: [''],
        busqueda: ['']
      })
    );
  }

  eliminarFiltro(index: number) {
    if(this.filtros.length > 1){
      this.filtros.removeAt(index);
    }
  }

  eliminarFiltroLista(index: string) {
    this.listaFiltros = this.listaFiltros.filter((filtro: any)=> filtro.id !== index)
  }

  open() {
    this.initForm()
    this.modalRef = this.modalService.open(this.customTemplate, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
  }

  agregar(){
    this.formularioItem.value['filtros'].map((filtro: any)=>{
      this.listaFiltros.push({
        id: crypto.randomUUID(),
        ...filtro
      })
    })

    console.log(this.listaFiltros);

    this.cerrarModal()
  }

  cerrarModal() {
    this.modalRef.dismiss('Cross click');
  }

  onPaisSeleccionado(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const pais = target.value;
    this.ciudades = this.ciudadesPorPais[pais];
  }
}
