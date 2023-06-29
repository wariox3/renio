import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDetalleComponent } from './item-detalle.component';

describe('ItemDetalleComponent', () => {
  let component: ItemDetalleComponent;
  let fixture: ComponentFixture<ItemDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
