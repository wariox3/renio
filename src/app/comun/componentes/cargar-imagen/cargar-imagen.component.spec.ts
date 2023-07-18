import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarImagenComponent } from './cargar-imagen.component';

describe('CargarImagenComponent', () => {
  let component: CargarImagenComponent;
  let fixture: ComponentFixture<CargarImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CargarImagenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargarImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
