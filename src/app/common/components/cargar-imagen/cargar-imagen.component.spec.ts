import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarImagenComponent } from './cargar-imagen.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Store, StoreModule } from '@ngrx/store'; // Importa el StoreModule
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('CargarImagenComponent', () => {
  let component: CargarImagenComponent;
  let fixture: ComponentFixture<CargarImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CargarImagenComponent,
        RouterTestingModule,
        StoreModule.forRoot({}),
        TranslateModule.forRoot()
      ],
      providers: [
        // Proporciona un Store mock para las pruebas
        provideMockStore(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CargarImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
