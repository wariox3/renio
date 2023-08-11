import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaNuevoComponent } from './factura-nuevo.component';

describe('FacturaNuevoComponent', () => {
  let component: FacturaNuevoComponent;
  let fixture: ComponentFixture<FacturaNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FacturaNuevoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturaNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
