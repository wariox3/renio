import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoNuevoComponent } from './contacto-nuevo.component';

describe('ContactoNuevoComponent', () => {
  let component: ContactoNuevoComponent;
  let fixture: ComponentFixture<ContactoNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactoNuevoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
