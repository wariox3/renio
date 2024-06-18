import { Component, OnInit } from '@angular/core';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-extended',
    templateUrl: './extended.component.html',
    styleUrls: ['./extended.component.scss'],
    standalone: true,
    imports: [KeeniconComponent],
})
export class ExtendedComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
