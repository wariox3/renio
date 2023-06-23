import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoEditarComponent } from './contacto-editar.component';

describe('ContactoEditarComponent', () => {
  let component: ContactoEditarComponent;
  let fixture: ComponentFixture<ContactoEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactoEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
