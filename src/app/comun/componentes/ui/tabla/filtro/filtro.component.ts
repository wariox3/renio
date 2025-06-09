import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
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
export class FiltroComponent {
  @ViewChildren('valueInputElement') valueInputElements!: QueryList<ElementRef>;
  @Input() availableFields: FilterField[] = [];
  @Output() filtersApply = new EventEmitter<FilterCondition[]>();

  filterConditions: FilterCondition[] = [this.createEmptyCondition()];

  operators: Operator[] = OPERADORES_FILTRO;
  addFilterCondition(): void {
    this.filterConditions.push(this.createEmptyCondition());
  }

  removeFilterCondition(index: number): void {
    this.filterConditions.splice(index, 1);
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

  applyFilters(): void {
    const validFilters = this.filterConditions.filter(
      (condition) =>
        condition.field &&
        condition.operator &&
        condition.value !== undefined &&
        condition.value !== '',
    );

    this.filtersApply.emit(validFilters);
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

  getPlaceholder(fieldName: string): string {
    if (!fieldName) return 'Valor';

    const field = this.availableFields.find(
      (field) => field.name === fieldName,
    );
    if (!field) return 'Valor';

    return `Ingrese ${field.displayName.toLowerCase()}`;
  }
}
