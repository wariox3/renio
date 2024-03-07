import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-importar',
  standalone: true,
  imports: [CommonModule, TranslateModule, TranslationModule],
  templateUrl: './importar.component.html',
  styleUrls: ['./importar.component.scss'],

})
export class ImportarComponent {

  archivoNombre: string = ""
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
  @ViewChild('fileInput',  { read: ElementRef }) fileInput: ElementRef<HTMLInputElement>;

  @Input() modelo:string
  modalRef: any;

  constructor(private modalService: NgbModal) {}


  open() {
    this.modalRef = this.modalService.open(this.customTemplate, {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
    });
  }

  cerrarModal() {
    this.modalRef.dismiss('Cross click');
  }

  descargarExcelErrorImportar() {
    let datos: any = [
      { name: 'John', age: 30, occupation: 'Engineer' },
      { name: 'Jane', age: 25, occupation: 'Designer' },
      // ... más datos ...
    ];

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, 'data.xlsx'); // Nombre del archivo Excel a descargar
  }

  archivoSeleccionado(event: any) {
    const selectedFile = event.target.files[0];
    this.archivoNombre = selectedFile.name
    // this.visualizarRemoverImagen = true;
    // if (event.target.files.length > 0) {
    //   this.modalRef = this.modalService.open(this.customTemplate, {
    //     backdrop: 'static',
    //     keyboard: false
    //   });
    //   this.imageChangedEvent = event;

    //   if (typeof FileReader !== 'undefined') {
    //     const reader = new FileReader();

    //     reader.onload = (e: any) => {
    //       this.srcResult = e.target.result;
    //     };
    //     reader.readAsDataURL(this.imageChangedEvent.target.files[0]);
    //   }
    //   event.target.files = null;
    //   this.changeDetectorRef.detectChanges();
    // }
  }

  removerArchivoSeleccionado() {
    this.archivoNombre = ''

  }

}
