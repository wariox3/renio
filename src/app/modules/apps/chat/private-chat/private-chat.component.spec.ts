import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateChatComponent } from './private-chat.component';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import {
  CardsModule,
  ChatInnerModule,
  DropdownMenusModule,
} from 'src/app/_metronic/partials';

describe('PrivateChatComponent', () => {
  let component: PrivateChatComponent;
  let fixture: ComponentFixture<PrivateChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [PrivateChatComponent],
    imports: [
        SharedModule,
        DropdownMenusModule,
        ChatInnerModule,
        CardsModule,
    ],
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
