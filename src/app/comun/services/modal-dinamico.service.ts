import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalDinamicoService {
  private eventSubject = new Subject<any>();
  event$ = this.eventSubject.asObservable();

  emitirEvento(data: any) {
    this.eventSubject.next(data);
  }
}
