import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionUsuarioComponent } from './informacion-usuario.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Store, StoreModule } from '@ngrx/store'; // Importa el StoreModule
import { provideMockStore } from '@ngrx/store/testing'; // Importa provideMockStore para proporcionar un Store mock

describe('InformacionUsuarioComponent', () => {
  let component: InformacionUsuarioComponent;
  let fixture: ComponentFixture<InformacionUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InformacionUsuarioComponent],
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({}), // Esto es un ejemplo; proporciona tus reducers reales aquí
      ],
      providers: [
        // Proporciona un Store mock para las pruebas
        provideMockStore(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InformacionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
