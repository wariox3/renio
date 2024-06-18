import { Component, OnInit } from '@angular/core';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';

@Component({
    selector: 'app-accounting',
    templateUrl: './accounting.component.html',
    styleUrls: ['./accounting.component.scss'],
    standalone: true,
    imports: [KeeniconComponent]
})
export class AccountingComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
