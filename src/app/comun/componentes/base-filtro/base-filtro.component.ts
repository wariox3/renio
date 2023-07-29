import { Component, TemplateRef, ViewChild, Input } from '@angular/core';
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
import { BaseFiltroFormularioComponent } from '../base-filtro-formulario/base-filtro-formulario.component';


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
    BaseFiltroFormularioComponent
  ],
})
export class BaseFiltroComponent {
  formularioItem: FormGroup;
  listaFiltros: any[] = []
  @Input() propiedades: any[];

  test:any[] = [
    {
      tipo: 'Texto',
      valor: 'nombre',
    },
    {
      tipo: 'Numero',
      valor: 'edad',
    },
    {
      tipo: 'Booleano',
      valor: 'esActivo',
    },
    {
      tipo: 'Fecha',
      valor: 'fecha',
    }
  ];

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
      busqueda: [''],
      entre:['']
    });
  }

  agregarFiltro() {
    this.filtros.push(
      this.formBuilder.group({
        propiedad: [''],
        criterio: [''],
        busqueda: [''],
        entre:['']
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
    
    //this.cerrarModal()
  }


  actualizarPropiedad(propiedad: string, index: number){
    const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
    filtroPorActualizar.patchValue({propiedad});
  }

  
  actualizarCriterio(criterio: string, index: number){
    const filtroPorActualizar = this.filtros.controls[index] as FormGroup;
    filtroPorActualizar.patchValue({criterio});
  }

  cerrarModal() {
    this.modalRef.dismiss('Cross click');
  }

}
