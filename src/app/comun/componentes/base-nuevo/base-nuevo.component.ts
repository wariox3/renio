import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comun-base-nuevo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './base-nuevo.component.html',
  styleUrls: ['./base-nuevo.component.scss']
})
export class BaseNuevoComponent {

  constructor(
  ) {}


}
