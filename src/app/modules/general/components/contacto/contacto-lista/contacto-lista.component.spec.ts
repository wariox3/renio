import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoListaComponent } from './contacto-lista.component';

describe('ContactoListaComponent', () => {
  let component: ContactoListaComponent;
  let fixture: ComponentFixture<ContactoListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactoListaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
