import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Contacto } from '../../../modelos/contacto';
import { ContactoService } from '../../../servicios/contacto.service';

@Component({
  selector: 'app-contacto-lista',
  templateUrl: './contacto-lista.component.html',
  styleUrls: ['./contacto-lista.component.scss'],
})
export class ContactoListaComponent implements OnInit {
  arrContacto: Contacto[] = [];

  constructor(
    private contactoService: ContactoService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista(): void {
    this.contactoService.lista().subscribe((respuesta) => {
      console.log(respuesta);
      this.arrContacto = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }
}
