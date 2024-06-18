import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingComponent } from './accounting.component';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';

describe('AccountingComponent', () => {
  let component: AccountingComponent;
  let fixture: ComponentFixture<AccountingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SharedModule, AccountingComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(AccountingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
