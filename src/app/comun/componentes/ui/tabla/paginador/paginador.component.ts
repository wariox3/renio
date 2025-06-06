import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-paginador',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './paginador.component.html',
  styleUrl: './paginador.component.scss',
})
export class PaginadorComponent implements OnChanges { 
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() itemsPerPage: number = 30;
  @Input() totalItems: number = 0;
  @Output() pageChange = new EventEmitter<number>();


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems']) {
      this.calculateTotalPages();
    }
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    // Asegurarnos que currentPage no exceda el totalPages
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
    }
  }

  onPageChange(newPage: number): void {
    // Validar que el número ingresado sea válido
    const parsedPage = Number(newPage);
    if (isNaN(parsedPage) || parsedPage < 1 || parsedPage > this.totalPages) {
      // Si no es válido, revertir al valor anterior
      setTimeout(() => {
        this.currentPage = this.currentPage;
      });
      return;
    }

    this.currentPage = parsedPage;
    this.pageChange.emit(this.currentPage);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.currentPage + 1);
    }
  }
}
