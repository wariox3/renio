import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '@modulos/i18n';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-comun-base-lista',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, TranslationModule],
  templateUrl: './base-lista.component.html',
  styleUrls: ['./base-lista.component.scss'],
})
export class BaseListaComponent {
  @ViewChild('dialogTemplate') customTemplate!: TemplateRef<any>;
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
}
