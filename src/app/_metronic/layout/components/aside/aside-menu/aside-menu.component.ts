import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { KeeniconComponent } from '../../../../shared/keenicon/keenicon.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-aside-menu',
    templateUrl: './aside-menu.component.html',
    styleUrls: ['./aside-menu.component.scss'],
    standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive,
        KeeniconComponent,
        TranslateModule,
    ],
})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

  constructor() {}

  ngOnInit(): void {}
}
