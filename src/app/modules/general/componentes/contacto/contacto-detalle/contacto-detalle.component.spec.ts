import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactoDetalleComponent } from './contacto-detalle.component';

describe('ContactoDetalleComponent', () => {
  let component: ContactoDetalleComponent;
  let fixture: ComponentFixture<ContactoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactoDetalleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
