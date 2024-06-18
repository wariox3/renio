import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { Store, StoreModule } from '@ngrx/store'; // Importa el StoreModule
import { provideMockStore } from '@ngrx/store/testing'; // Importa provideMockStore para proporcionar un Store mock

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        StoreModule.forRoot({}),
        NavbarComponent,
    ],
    providers: [
        // Proporciona un Store mock para las pruebas
        provideMockStore(),
    ]
})
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
