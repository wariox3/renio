import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseNuevoComponent } from './BaseNuevoComponent';

describe('BaseNuevoComponent', () => {
  let component: BaseNuevoComponent;
  let fixture: ComponentFixture<BaseNuevoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseNuevoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseNuevoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear', () => {
    expect(component).toBeTruthy();
  });
});
