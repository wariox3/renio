import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarMenuComponent } from './sidebar-menu.component';
import { Store, StoreModule } from '@ngrx/store'; // Importa el StoreModule
import { provideMockStore } from '@ngrx/store/testing'; // Importa provideMockStore para proporcionar un Store mock
import { SharedModule } from 'src/app/_metronic/shared/shared.module';

describe('SidebarMenuComponent', () => {
  let component: SidebarMenuComponent;
  let fixture: ComponentFixture<SidebarMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        StoreModule.forRoot({}),
        SharedModule // Esto es un ejemplo; proporciona tus reducers reales aquí
        ,
        SidebarMenuComponent
    ],
    providers: [
        // Proporciona un Store mock para las pruebas
        provideMockStore(),
    ]
})
    .compileComponents();

    fixture = TestBed.createComponent(SidebarMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
