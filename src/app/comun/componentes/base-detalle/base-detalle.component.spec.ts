import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDetalleComponent } from './base-detalle.component';

describe('BaseDetalleComponent', () => {
  let component: BaseDetalleComponent;
  let fixture: ComponentFixture<BaseDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseDetalleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });
});
