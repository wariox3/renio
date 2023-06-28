import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { obtenerEmpresaNombre } from '@redux/selectors/empresa-nombre.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  constructor(
    private store: Store
  ) {}

  ngOnInit(): void {}

  empresaNombre = this.store.select(obtenerEmpresaNombre);

}
