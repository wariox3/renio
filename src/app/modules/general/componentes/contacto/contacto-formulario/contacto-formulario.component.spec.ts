import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoFormularioComponent } from './contacto-formulario.component';

describe('ContactoFormularioComponent', () => {
  let component: ContactoFormularioComponent;
  let fixture: ComponentFixture<ContactoFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactoFormularioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
