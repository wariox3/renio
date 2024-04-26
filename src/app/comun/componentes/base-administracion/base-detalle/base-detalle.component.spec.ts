import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDetalleComponent } from './base-detalle.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store'; // Importa el StoreModule
import { provideMockStore } from '@ngrx/store/testing';
import { AlertaService } from '@comun/services/alerta.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('BaseDetalleComponent', () => {
  let component: BaseDetalleComponent;
  let fixture: ComponentFixture<BaseDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BaseDetalleComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        StoreModule.forRoot({}),
        AlertaService,
        BrowserDynamicTestingModule
      ],
      providers: [
        provideMockStore(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });
});
