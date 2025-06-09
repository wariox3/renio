import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FilterCondition,
  FilterField,
  Operator,
} from '../../../../../core/interfaces/filtro.interface';
import { OPERADORES_FILTRO } from 'src/app/core/constants/filter/operadores-filtro.constant';

@Component({
  selector: 'app-filtro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filtro.component.html',
  styleUrl: './filtro.component.scss',
})
export class FiltroComponent implements OnInit {
  @ViewChildren('valueInputElement') valueInputElements!: QueryList<ElementRef>;
  @Input() availableFields: FilterField[] = [];
  @Output() filtersApply = new EventEmitter<FilterCondition[]>();
  @Input() localStorageKey: string | null = null;

  filterConditions: FilterCondition[] = []; // Initialize as empty, will be populated in ngOnInit
  operators: Operator[] = OPERADORES_FILTRO;

  ngOnInit(): void {
    this._loadFiltersFromLocalStorage();
  }

  addFilterCondition(): void {
    this.filterConditions.push(this.createEmptyCondition());
  }

  removeFilterCondition(index: number): void {
    this.filterConditions.splice(index, 1);
    if (this.filterConditions.length === 0) { // Ensure there's always at least one filter row if all are removed
        this.filterConditions.push(this.createEmptyCondition());
    }
  }

  onFieldChange(condition: FilterCondition, index: number): void {
    condition.value = ''; // Reset value first
    condition.operator = ''; // Reset operator

    if (!condition.field) {
      return;
    }

    const selectedField = this.availableFields.find(
      (field) => field.name === condition.field,
    );

    if (!selectedField) {
      return;
    }

    const operatorsForField = this.getOperatorsForField(condition.field);
    const defaultOperator = operatorsForField.find((op) => op.default);

    if (defaultOperator) {
      condition.operator = defaultOperator.symbol;
    }
    // If no defaultOperator, condition.operator remains '', which is the desired state.

    // Autofocus the value input/select
    setTimeout(() => {
      const inputElement = this.valueInputElements?.toArray()[index];
      if (inputElement && inputElement.nativeElement) {
        inputElement.nativeElement.focus();
      }
    });
  }

  handleEnterKey(): void {
    // Check if there's at least one filter condition with a field, operator, and value
    // This prevents applying filters if the user just hits enter on an empty row or incomplete filter
    const canApply = this.filterConditions.some(
      (fc) => fc.field && fc.operator && fc.value !== undefined && fc.value !== ''
    );
    
    if (canApply) {
      this.applyFilters();
    }
  }

  applyFilters(): void {
    const validFilters = this.filterConditions.filter(
      (condition) =>
        condition.field &&
        condition.operator &&
        condition.value !== undefined &&
        condition.value !== '',
    );

    this.filtersApply.emit(validFilters);
    this._saveFiltersToLocalStorage(); // Save current filterConditions state when applying
  }

  getOperatorsForField(fieldName: string): Operator[] {
    const field = this.availableFields.find(
      (field) => field.name === fieldName,
    );
    if (!field) return [];

    return this.operators.filter((op) => op.types.includes(field.type));
  }

  private createEmptyCondition(): FilterCondition {
    return { field: '', operator: '', value: '' };
  }

  getInputType(fieldName: string): string {
    if (!fieldName) return 'text';

    const field = this.availableFields.find(
      (field) => field.name === fieldName,
    );
    if (!field) return 'text';

    switch (field.type) {
      case 'date':
        return 'date';
      case 'number':
        return 'number';
      case 'boolean':
        return 'boolean';
      default:
        return 'text';
    }
  }

  private _loadFiltersFromLocalStorage(): void {
    if (!this.localStorageKey || typeof localStorage === 'undefined') {
      this.filterConditions = [this.createEmptyCondition()];
      return;
    }

    try {
      const savedFilters = localStorage.getItem(this.localStorageKey);
      if (!savedFilters) {
        this.filterConditions = [this.createEmptyCondition()];
        return;
      }

      const parsedFilters: FilterCondition[] = JSON.parse(savedFilters);
      if (!Array.isArray(parsedFilters) || parsedFilters.length === 0) {
        this.filterConditions = [this.createEmptyCondition()];
        return;
      }

      this.filterConditions = parsedFilters;
    } catch (error) {
      console.error('Error loading filters from localStorage:', error);
      this.filterConditions = [this.createEmptyCondition()];
    }
  }

  clearAllFilters(): void {
    this.filterConditions = [this.createEmptyCondition()];
    if (this.localStorageKey && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(this.localStorageKey);
      } catch (error) {
        console.error('Error removing filters from localStorage:', error);
      }
    }
    // Emit an empty valid filter or an array with one empty condition to signify reset
    this.filtersApply.emit([]); // Or this.filtersApply.emit(this.filterConditions) if parent expects at least one row
  }

  private _saveFiltersToLocalStorage(): void {
    if (this.localStorageKey && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.filterConditions));
      } catch (error) {
        console.error('Error saving filters to localStorage:', error);
      }
    }
  }

  getPlaceholder(fieldName: string): string {
    if (!fieldName) return 'Valor';

    const field = this.availableFields.find(
      (field) => field.name === fieldName,
    );
    if (!field) return 'Valor';

    return `Ingrese ${field.displayName.toLowerCase()}`;
  }
}
