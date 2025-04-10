import { Component, HostBinding } from '@angular/core';
import { environment } from '@env/environment';

@Component({
    selector: 'app-quick-links-inner',
    templateUrl: './quick-links-inner.component.html',
    standalone: true,
    imports: [],
})
export class QuickLinksInnerComponent {

  @HostBinding('class') class =
    'menu menu-sub menu-sub-dropdown menu-column w-250px w-lg-325px';
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  constructor() {}

  navegarPos(){
    let dominioActual = window.location.host;
    window.open(`${environment.dominioHttp}://POS${environment.dominioApp}/general/facturacion/${dominioActual.split('.')[0]}`, '_blank', 'noopener,noreferrer');
  }
}
