import { Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KeeniconComponent } from '../../../../../shared/keenicon/keenicon.component';
import { environment } from '@env/environment';

@Component({
    selector: 'app-quick-links-inner',
    templateUrl: './quick-links-inner.component.html',
    standalone: true,
    imports: [KeeniconComponent, RouterLink],
})
export class QuickLinksInnerComponent {
  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column w-250px w-lg-325px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  constructor() {}

  navegarPos(){
    window.open(`${environment.dominioHttp}://POS${environment.dominioApp}/`, '_blank', 'noopener,noreferrer');
  }
}
