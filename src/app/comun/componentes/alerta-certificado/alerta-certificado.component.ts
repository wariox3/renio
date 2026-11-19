import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ALERTA_CERTIFICADO_CONFIG } from './alerta-certificado.config';

const SESSION_KEY = 'alerta_certificado_vista';

@Component({
  selector: 'app-comun-alerta-certificado',
  templateUrl: './alerta-certificado.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class AlertaCertificadoComponent implements AfterViewInit {
  @ViewChild('modalCertificado') modalCertificado: TemplateRef<any>;

  private _modalService = inject(NgbModal);

  config = ALERTA_CERTIFICADO_CONFIG;
  diasRestantes = 0;

  get telefonoFormateado(): string {
    const t = this.config.telefonoSoporte;
    return `${t.slice(0, 3)} ${t.slice(3, 6)} ${t.slice(6)}`;
  }

  ngAfterViewInit(): void {
    if (!this._debeMostrarse()) return;
    // setTimeout evita ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this._modalService.open(this.modalCertificado, {
        centered: true,
        backdrop: 'static',
        keyboard: false,
      });
      this._marcarComoVista();
    });
  }

  private _debeMostrarse(): boolean {
    if (!this.config.activo) return false;

    this.diasRestantes = this._calcularDiasRestantes();
    if (this.diasRestantes > this.config.diasAnticipacion) return false;

    // Con 1 día o menos (o vencido) se muestra siempre;
    // antes de eso, solo una vez por sesión.
    if (this.diasRestantes <= 1) return true;
    return !this._yaFueVista();
  }

  private _calcularDiasRestantes(): number {
    const [anio, mes, dia] = this.config.fechaVencimiento
      .split('-')
      .map(Number);
    const vencimiento = new Date(anio, mes - 1, dia);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return Math.round(
      (vencimiento.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  private _yaFueVista(): boolean {
    try {
      return sessionStorage.getItem(SESSION_KEY) === this.config.fechaVencimiento;
    } catch {
      return false;
    }
  }

  private _marcarComoVista(): void {
    try {
      sessionStorage.setItem(SESSION_KEY, this.config.fechaVencimiento);
    } catch {}
  }
}
