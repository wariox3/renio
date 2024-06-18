import { Component, OnInit } from '@angular/core';
import { ChatInnerComponent } from '../../../content/chat-inner/chat-inner.component';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-messenger-drawer',
    templateUrl: './messenger-drawer.component.html',
    standalone: true,
    imports: [KeeniconComponent, ChatInnerComponent],
})
export class MessengerDrawerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
