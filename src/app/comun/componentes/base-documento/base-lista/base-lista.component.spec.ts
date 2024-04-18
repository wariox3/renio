import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseListaComponent } from './base-lista.component';

describe('BaseListaComponent', () => {
  let component: BaseListaComponent;
  let fixture: ComponentFixture<BaseListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseListaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });
});
