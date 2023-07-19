import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaFacturacionComponent } from './empresa-facturacion.component';

describe('EmpresaFacturacionComponent', () => {
  let component: EmpresaFacturacionComponent;
  let fixture: ComponentFixture<EmpresaFacturacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresaFacturacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaFacturacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
