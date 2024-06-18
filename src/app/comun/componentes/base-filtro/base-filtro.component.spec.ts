import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseFiltroComponent } from './base-filtro.component';

describe('BaseFiltroComponent', () => {
  let component: BaseFiltroComponent;
  let fixture: ComponentFixture<BaseFiltroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [BaseFiltroComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(BaseFiltroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
