import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnwhatsappComponent } from './btnwhatsapp.component';

describe('BtnwhatsappComponent', () => {
  let component: BtnwhatsappComponent;
  let fixture: ComponentFixture<BtnwhatsappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ BtnwhatsappComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BtnwhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
