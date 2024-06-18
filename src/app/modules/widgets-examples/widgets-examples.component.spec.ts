import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsExamplesComponent } from './widgets-examples.component';
import { RouterModule } from '@angular/router';

describe('WidgetsExamplesComponent', () => {
  let component: WidgetsExamplesComponent;
  let fixture: ComponentFixture<WidgetsExamplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [WidgetsExamplesComponent],
    imports: [
        RouterModule.forRoot([]),
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetsExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
