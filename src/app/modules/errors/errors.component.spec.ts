import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsComponent } from './errors.component';
import { RouterModule } from '@angular/router';

describe('ErrorsComponent', () => {
  let component: ErrorsComponent;
  let fixture: ComponentFixture<ErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RouterModule.forRoot([]), ErrorsComponent],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
