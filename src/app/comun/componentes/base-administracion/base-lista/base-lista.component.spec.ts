import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseListaComponent } from './base-lista.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterModule } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store'; // Importa el StoreModule
import { provideMockStore } from '@ngrx/store/testing';
import { AlertaService } from '@comun/services/alerta.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('BaseListaComponent', () => {
  let component: BaseListaComponent;
  let fixture: ComponentFixture<BaseListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BaseListaComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        RouterModule.forRoot([]),
        StoreModule.forRoot({}),
        BrowserDynamicTestingModule
      ],
      providers: [
        // Proporciona un Store mock para las pruebas
        provideMockStore(),
        AlertaService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });
});
