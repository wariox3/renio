import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemNuevoComponent } from './item-nuevo.component';

describe('ItemNuevoComponent', () => {
  let component: ItemNuevoComponent;
  let fixture: ComponentFixture<ItemNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemNuevoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
