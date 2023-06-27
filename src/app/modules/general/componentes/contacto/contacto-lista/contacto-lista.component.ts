import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Contacto } from '../../../modelos/contacto';
import { ContactoService } from '../../../servicios/contacto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacto-lista',
  templateUrl: './contacto-lista.component.html',
  styleUrls: ['./contacto-lista.component.scss'],
})
export class ContactoListaComponent implements OnInit {
  arrContacto: Contacto[] = [];
  arrEncabezado: string[] = [
    'apellido',
    'apellido2',
    'celular',
    'ciudad',
    'codigo_postal',
    'correo',
    'digito_verificacion',
    'direccion',
    'id',
    'identificacion',
    'nombre1',
    'nombre2',
    'nombre_corto',
    'numero_identificacion',
    'regimen',
    'telefono',
    'tipo_persona'
  ]

  constructor(
    private contactoService: ContactoService,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.consultarLista();
  }

  consultarLista(): void {
    this.contactoService.lista().subscribe((respuesta) => {
      this.arrContacto = respuesta;
      this.changeDetectorRef.detectChanges();
    });
  }

  detalle(){
    this.router.navigate(['/detalle']);
  }
}
