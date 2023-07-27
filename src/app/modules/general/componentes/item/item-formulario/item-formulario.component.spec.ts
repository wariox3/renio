import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFormularioComponent } from './item-formulario.component';

describe('ItemFormularioComponent', () => {
  let component: ItemFormularioComponent;
  let fixture: ComponentFixture<ItemFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemFormularioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
