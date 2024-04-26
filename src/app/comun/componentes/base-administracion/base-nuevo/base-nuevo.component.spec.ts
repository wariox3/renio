import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseNuevoComponent } from './base-nuevo.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';

describe('BaseNuevoComponent', () => {
  let component: BaseNuevoComponent;
  let fixture: ComponentFixture<BaseNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BaseNuevoComponent,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserDynamicTestingModule
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });
});
