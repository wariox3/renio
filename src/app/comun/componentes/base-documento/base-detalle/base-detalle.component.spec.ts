import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseDetalleComponent } from './base-detalle.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AlertaService } from '@comun/services/alerta.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('BaseNuevoComponent', () => {
  let component: BaseDetalleComponent;
  let fixture: ComponentFixture<BaseDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BaseDetalleComponent,
        HttpClientTestingModule,
        AlertaService,
        BrowserDynamicTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });
});
