import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerChatComponent } from './drawer-chat.component';
import { CardsModule } from 'src/app/_metronic/partials';

describe('DrawerChatComponent', () => {
  let component: DrawerChatComponent;
  let fixture: ComponentFixture<DrawerChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [DrawerChatComponent],
    imports: [CardsModule],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawerChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
