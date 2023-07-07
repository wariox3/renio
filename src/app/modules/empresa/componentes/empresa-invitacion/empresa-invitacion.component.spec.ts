import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaInvitacionComponent } from './empresa-invitacion.component';

describe('EmpresaInvitacionComponent', () => {
  let component: EmpresaInvitacionComponent;
  let fixture: ComponentFixture<EmpresaInvitacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresaInvitacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresaInvitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
