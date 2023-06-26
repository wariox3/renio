import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReiniciarClaveComponent } from './reiniciar-clave.component';

describe('ReiniciarClaveComponent', () => {
  let component: ReiniciarClaveComponent;
  let fixture: ComponentFixture<ReiniciarClaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReiniciarClaveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReiniciarClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
