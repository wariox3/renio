import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaNuevoComponent } from './empresa-nuevo.component';

describe('EmpresaNuevoComponent', () => {
  let component: EmpresaNuevoComponent;
  let fixture: ComponentFixture<EmpresaNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresaNuevoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
