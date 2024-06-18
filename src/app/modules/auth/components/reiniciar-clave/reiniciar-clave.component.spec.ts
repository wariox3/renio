import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReiniciarClaveComponent } from './reiniciar-clave.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ReiniciarClaveComponent', () => {
  let component: ReiniciarClaveComponent;
  let fixture: ComponentFixture<ReiniciarClaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HttpClientTestingModule, ReiniciarClaveComponent]
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
